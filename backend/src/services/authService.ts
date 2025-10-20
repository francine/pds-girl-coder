import { ObjectId } from 'mongodb';
import { getUserCollection, User, sanitizeUser } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { ValidationError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';
import { isValidEmail, validateStringLength } from '../utils/validation.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwtService.js';
import { startOfWeek } from '../utils/dateUtils.js';

interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export async function register(
  email: string,
  password: string,
  name: string,
  timezone: string = 'UTC'
): Promise<AuthResponse> {
  // Validation
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  const passwordValidation = validateStringLength(password, 8);
  if (!passwordValidation.valid) {
    throw new ValidationError(`Password ${passwordValidation.error}`);
  }

  const nameValidation = validateStringLength(name, 1, 200);
  if (!nameValidation.valid) {
    throw new ValidationError(`Name ${nameValidation.error}`);
  }

  // Check for existing user
  const users = getUserCollection();
  const existingUser = await users.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const now = new Date();

  const newUser: User = {
    email: email.toLowerCase(),
    passwordHash,
    name,
    timezone,
    skills: [],
    targetIndustries: [],
    targetRegions: [],
    weeklyConnectionLimit: 100,
    currentWeekConnectionCount: 0,
    weekStartDate: startOfWeek(now),
    linkedinIntegration: {
      connected: false,
    },
    notifications: {
      email: {
        enabled: true,
        address: email.toLowerCase(),
      },
      desktop: {
        enabled: false,
      },
      appointmentReminder: {
        enabled: true,
        minutesBefore: 60,
      },
    },
    createdAt: now,
    updatedAt: now,
  };

  const result = await users.insertOne(newUser);
  const user = { ...newUser, _id: result.insertedId };

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const users = getUserCollection();
  const user = await users.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login
  await users.updateOne(
    { _id: user._id },
    { $set: { updatedAt: new Date() } }
  );

  // Generate tokens
  const accessToken = generateAccessToken(user._id!.toString());
  const refreshToken = generateRefreshToken(user._id!.toString());

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const payload = verifyRefreshToken(refreshToken);
  return generateAccessToken(payload.userId);
}

export async function getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
  const users = getUserCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return sanitizeUser(user);
}
