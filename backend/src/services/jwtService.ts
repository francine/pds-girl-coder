import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

function getSecret(type: 'access' | 'refresh'): string {
  const secret = type === 'access'
    ? process.env.JWT_SECRET
    : process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(`JWT_${type.toUpperCase()}_SECRET is not configured`);
  }

  return secret;
}

export function generateAccessToken(userId: string): string {
  const payload: TokenPayload = { userId, type: 'access' };
  return jwt.sign(payload, getSecret('access'), { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(userId: string): string {
  const payload: TokenPayload = { userId, type: 'refresh' };
  return jwt.sign(payload, getSecret('refresh'), { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getSecret('access')) as TokenPayload;
    if (decoded.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid access token');
    }
    throw error;
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getSecret('refresh')) as TokenPayload;
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw error;
  }
}
