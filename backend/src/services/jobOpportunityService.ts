import { ObjectId } from 'mongodb';
import { getJobOpportunityCollection, JobOpportunity, JobStage } from '../models/JobOpportunity.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { validateStringLength } from '../utils/validation.js';

export async function createJobOpportunity(
  userId: string,
  data: {
    company: string;
    position: string;
    description: string;
    contactEmail?: string;
    contactName?: string;
    contactPhone?: string;
    jobPostingUrl?: string;
    companyWebsite?: string;
    notes?: string;
    salary?: { min: number; max: number; currency: string };
    location?: string;
    remoteType?: 'remote' | 'hybrid' | 'onsite';
  }
): Promise<JobOpportunity> {
  // Validation
  const companyValidation = validateStringLength(data.company, 1, 200);
  if (!companyValidation.valid) {
    throw new ValidationError(`Company ${companyValidation.error}`);
  }

  const positionValidation = validateStringLength(data.position, 1, 200);
  if (!positionValidation.valid) {
    throw new ValidationError(`Position ${positionValidation.error}`);
  }

  const now = new Date();
  const jobOpportunity: JobOpportunity = {
    userId: new ObjectId(userId),
    company: data.company,
    position: data.position,
    description: data.description || '',
    stage: 'initial_contacts',
    stageHistory: [
      {
        stage: 'initial_contacts',
        timestamp: now,
      },
    ],
    contactEmail: data.contactEmail,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    jobPostingUrl: data.jobPostingUrl,
    companyWebsite: data.companyWebsite,
    notes: data.notes || '',
    attachments: [],
    salary: data.salary,
    location: data.location,
    remoteType: data.remoteType,
    createdAt: now,
    updatedAt: now,
  };

  const collection = getJobOpportunityCollection();
  const result = await collection.insertOne(jobOpportunity);

  return { ...jobOpportunity, _id: result.insertedId };
}

export async function getJobOpportunities(
  userId: string,
  filters?: { stage?: string }
): Promise<JobOpportunity[]> {
  const collection = getJobOpportunityCollection();
  const query: any = { userId: new ObjectId(userId) };

  if (filters?.stage) {
    query.stage = filters.stage;
  }

  return collection.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getJobOpportunityById(
  userId: string,
  opportunityId: string
): Promise<JobOpportunity> {
  const collection = getJobOpportunityCollection();
  const opportunity = await collection.findOne({
    _id: new ObjectId(opportunityId),
    userId: new ObjectId(userId),
  });

  if (!opportunity) {
    throw new NotFoundError('Job opportunity not found');
  }

  return opportunity;
}

export async function updateJobOpportunity(
  userId: string,
  opportunityId: string,
  data: Partial<JobOpportunity>
): Promise<JobOpportunity> {
  const collection = getJobOpportunityCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(opportunityId), userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Job opportunity not found');
  }

  return result;
}

export async function updateJobStage(
  userId: string,
  opportunityId: string,
  newStage: JobStage,
  notes?: string
): Promise<JobOpportunity> {
  const collection = getJobOpportunityCollection();

  const now = new Date();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(opportunityId), userId: new ObjectId(userId) },
    {
      $set: { stage: newStage, updatedAt: now },
      $push: {
        stageHistory: {
          stage: newStage,
          timestamp: now,
          notes,
        },
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Job opportunity not found');
  }

  return result;
}

export async function deleteJobOpportunity(
  userId: string,
  opportunityId: string
): Promise<void> {
  const collection = getJobOpportunityCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(opportunityId),
    userId: new ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Job opportunity not found');
  }
}
