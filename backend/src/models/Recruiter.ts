import { ObjectId, Collection } from 'mongodb';
import { getDB } from '../config/database.js';

export interface GeneratedMessage {
  message: string;
  generatedAt: Date;
  used: boolean;
}

export interface SearchCriteria {
  region: string[];
  industry: string[];
  keywords: string[];
}

export interface Recruiter {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  company: string;
  location: string;
  industry?: string;
  linkedinProfileUrl: string;
  status: 'discovered' | 'connection_sent' | 'connected' | 'rejected';
  discoveredAt: Date;
  connectionSentAt?: Date;
  connectedAt?: Date;
  rejectedAt?: Date;
  connectionWeek?: Date;
  generatedMessages: GeneratedMessage[];
  notes: string;
  searchCriteria?: SearchCriteria;
  createdAt: Date;
  updatedAt: Date;
}

export function getRecruiterCollection(): Collection<Recruiter> {
  return getDB().collection<Recruiter>('recruiters');
}

export async function createRecruiterIndexes(): Promise<void> {
  const collection = getRecruiterCollection();
  await collection.createIndex({ userId: 1, status: 1 });
  await collection.createIndex(
    { userId: 1, linkedinProfileUrl: 1 },
    { unique: true }
  );
  await collection.createIndex({ userId: 1, connectionWeek: 1 });
  await collection.createIndex({ userId: 1, discoveredAt: -1 });
}
