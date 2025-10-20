import { ObjectId, Collection } from 'mongodb';
import { getDB } from '../config/database.js';

export type JobStage =
  | 'initial_contacts'
  | 'in_progress'
  | 'interview'
  | 'proposal'
  | 'negotiation'
  | 'deal_closed'
  | 'archived';

export interface StageHistoryEntry {
  stage: JobStage;
  timestamp: Date;
  notes?: string;
}

export interface Attachment {
  filename: string;
  url: string;
  uploadedAt: Date;
}

export interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface JobOpportunity {
  _id?: ObjectId;
  userId: ObjectId;
  company: string;
  position: string;
  description: string;
  stage: JobStage;
  stageHistory: StageHistoryEntry[];
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
  recruiterId?: ObjectId;
  jobPostingUrl?: string;
  companyWebsite?: string;
  notes: string;
  attachments: Attachment[];
  salary?: Salary;
  location?: string;
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  createdAt: Date;
  updatedAt: Date;
}

export function getJobOpportunityCollection(): Collection<JobOpportunity> {
  return getDB().collection<JobOpportunity>('jobOpportunities');
}

export async function createJobOpportunityIndexes(): Promise<void> {
  const collection = getJobOpportunityCollection();
  await collection.createIndex({ userId: 1, stage: 1 });
  await collection.createIndex({ userId: 1, createdAt: -1 });
  await collection.createIndex({ recruiterId: 1 });
}
