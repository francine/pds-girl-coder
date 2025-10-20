import { ObjectId, Collection } from 'mongodb';
import { getDB } from '../config/database.js';

export interface LinkedInIntegration {
  connected: boolean;
  accessToken?: string; // Encrypted
  refreshToken?: string; // Encrypted
  expiresAt?: Date;
  linkedinId?: string;
  profileUrl?: string;
  ssiScore?: number;
  lastSsiUpdate?: Date;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    address: string;
  };
  desktop: {
    enabled: boolean;
    subscription?: object;
  };
  appointmentReminder: {
    enabled: boolean;
    minutesBefore: number;
  };
}

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  linkedinIntegration: LinkedInIntegration;
  timezone: string;
  skills: string[];
  targetIndustries: string[];
  targetRegions: string[];
  weeklyConnectionLimit: number;
  currentWeekConnectionCount: number;
  weekStartDate: Date;
  notifications: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export function getUserCollection(): Collection<User> {
  return getDB().collection<User>('users');
}

export async function createUserIndexes(): Promise<void> {
  const collection = getUserCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ weekStartDate: 1 });
}

export function sanitizeUser(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
}
