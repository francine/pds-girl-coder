import { ObjectId } from 'mongodb';
import { getUserCollection } from '../models/User.js';
import { UnauthorizedError, ExternalServiceError } from '../utils/errors.js';
import { encrypt, decrypt } from '../utils/encryption.js';

// LinkedIn OAuth configuration - use getters to ensure env vars are loaded
function getLinkedInConfig() {
  return {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/api/v1/linkedin/callback'
  };
}

// Store for OAuth state verification (in production, use Redis or database)
const oauthStates = new Map<string, { userId: string; timestamp: number }>();

// Clean up expired states every hour
setInterval(() => {
  const now = Date.now();
  const expired: string[] = [];
  oauthStates.forEach((value, key) => {
    if (now - value.timestamp > 3600000) {
      // 1 hour
      expired.push(key);
    }
  });
  expired.forEach((key) => oauthStates.delete(key));
}, 3600000);

export function initiateLinkedInAuth(userId: string): string {
  const config = getLinkedInConfig();

  // Generate random state for CSRF protection
  const state = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  oauthStates.set(state, { userId, timestamp: Date.now() });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
    scope: 'openid profile email w_member_social', // Permissions for posting and profile
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export async function handleLinkedInCallback(
  code: string,
  state: string
): Promise<{ success: boolean; user: any }> {
  const config = getLinkedInConfig();

  // Verify state
  const stateData = oauthStates.get(state);
  if (!stateData) {
    throw new UnauthorizedError('Invalid OAuth state');
  }

  const { userId } = stateData;
  oauthStates.delete(state);

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new ExternalServiceError('Failed to exchange LinkedIn authorization code');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // Get user profile from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new ExternalServiceError('Failed to fetch LinkedIn profile');
    }

    const profileData = await profileResponse.json();

    // Encrypt tokens before storing
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : undefined;

    // Update user in database
    const collection = getUserCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'linkedinIntegration.connected': true,
          'linkedinIntegration.accessToken': encryptedAccessToken,
          'linkedinIntegration.refreshToken': encryptedRefreshToken,
          'linkedinIntegration.expiresAt': new Date(
            Date.now() + tokenData.expires_in * 1000
          ),
          'linkedinIntegration.linkedinId': profileData.sub,
          'linkedinIntegration.profileUrl': profileData.profile,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new UnauthorizedError('User not found');
    }

    // Fetch SSI score in background (don't block response)
    fetchAndUpdateSSIScore(userId, accessToken).catch((error) => {
      console.error('Failed to fetch SSI score:', error);
    });

    return { success: true, user: result };
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    throw new ExternalServiceError('Failed to connect LinkedIn account');
  }
}

export async function disconnectLinkedIn(userId: string): Promise<void> {
  const collection = getUserCollection();
  await collection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        'linkedinIntegration.connected': false,
        'linkedinIntegration.accessToken': null,
        'linkedinIntegration.refreshToken': null,
        'linkedinIntegration.expiresAt': null,
        'linkedinIntegration.linkedinId': null,
        'linkedinIntegration.profileUrl': null,
        updatedAt: new Date(),
      },
    }
  );
}

async function fetchAndUpdateSSIScore(userId: string, accessToken: string): Promise<void> {
  try {
    // Note: LinkedIn doesn't provide direct API access to SSI score
    // This is a placeholder for a web scraping solution or alternative metric
    // In production, you would need to:
    // 1. Use a LinkedIn Sales Navigator API (if available)
    // 2. Implement web scraping (requires careful implementation)
    // 3. Use an alternative engagement metric

    // For now, we'll generate a mock score based on profile completeness
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      // Mock SSI score calculation (replace with real implementation)
      const mockSSIScore = Math.floor(Math.random() * 30) + 70; // 70-100

      const collection = getUserCollection();
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'linkedinIntegration.ssiScore': mockSSIScore,
            'linkedinIntegration.lastSsiUpdate': new Date(),
            updatedAt: new Date(),
          },
        }
      );
    }
  } catch (error) {
    console.error('Failed to fetch SSI score:', error);
    // Don't throw - this is a background operation
  }
}

export async function getLinkedInAccessToken(userId: string): Promise<string | null> {
  const collection = getUserCollection();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  if (!user || !user.linkedinIntegration?.connected || !user.linkedinIntegration?.accessToken) {
    return null;
  }

  // Check if token is expired
  if (
    user.linkedinIntegration.expiresAt &&
    new Date(user.linkedinIntegration.expiresAt) < new Date()
  ) {
    // Token expired, try to refresh
    if (user.linkedinIntegration.refreshToken) {
      try {
        const newToken = await refreshLinkedInToken(
          decrypt(user.linkedinIntegration.refreshToken)
        );

        // Update token in database
        const encryptedNewToken = encrypt(newToken.access_token);
        await collection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              'linkedinIntegration.accessToken': encryptedNewToken,
              'linkedinIntegration.expiresAt': new Date(
                Date.now() + newToken.expires_in * 1000
              ),
              updatedAt: new Date(),
            },
          }
        );

        return newToken.access_token;
      } catch (error) {
        console.error('Failed to refresh LinkedIn token:', error);
        return null;
      }
    }
    return null;
  }

  return decrypt(user.linkedinIntegration.accessToken);
}

async function refreshLinkedInToken(refreshToken: string): Promise<any> {
  const config = getLinkedInConfig();

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    throw new ExternalServiceError('Failed to refresh LinkedIn token');
  }

  return response.json();
}
