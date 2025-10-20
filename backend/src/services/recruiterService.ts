import { ObjectId } from 'mongodb';
import { getRecruiterCollection, Recruiter, GeneratedMessage } from '../models/Recruiter.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { validateStringLength, isValidUrl } from '../utils/validation.js';
import { startOfWeek } from '../utils/dateUtils.js';
import { generateContactMessages } from './linkedinSearchService.js';

export async function createRecruiter(
  userId: string,
  data: {
    name: string;
    company: string;
    location: string;
    industry?: string;
    linkedinProfileUrl: string;
    notes?: string;
    searchCriteria?: {
      region: string[];
      industry: string[];
      keywords: string[];
    };
  }
): Promise<Recruiter> {
  // Validation
  const nameValidation = validateStringLength(data.name, 1, 200);
  if (!nameValidation.valid) {
    throw new ValidationError(`Name ${nameValidation.error}`);
  }

  const companyValidation = validateStringLength(data.company, 1, 200);
  if (!companyValidation.valid) {
    throw new ValidationError(`Company ${companyValidation.error}`);
  }

  if (!isValidUrl(data.linkedinProfileUrl)) {
    throw new ValidationError('Invalid LinkedIn profile URL');
  }

  // Check for duplicate
  const collection = getRecruiterCollection();
  const existing = await collection.findOne({
    userId: new ObjectId(userId),
    linkedinProfileUrl: data.linkedinProfileUrl,
  });

  if (existing) {
    throw new ValidationError('This recruiter is already in your list');
  }

  const now = new Date();
  const recruiter: Recruiter = {
    userId: new ObjectId(userId),
    name: data.name,
    company: data.company,
    location: data.location,
    industry: data.industry,
    linkedinProfileUrl: data.linkedinProfileUrl,
    status: 'discovered',
    discoveredAt: now,
    generatedMessages: [],
    notes: data.notes || '',
    searchCriteria: data.searchCriteria,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(recruiter);
  return { ...recruiter, _id: result.insertedId };
}

export async function getRecruiters(
  userId: string,
  filters?: { status?: string }
): Promise<Recruiter[]> {
  const collection = getRecruiterCollection();
  const query: any = { userId: new ObjectId(userId) };

  if (filters?.status) {
    query.status = filters.status;
  }

  return collection.find(query).sort({ discoveredAt: -1 }).toArray();
}

export async function getRecruiterById(
  userId: string,
  recruiterId: string
): Promise<Recruiter> {
  const collection = getRecruiterCollection();
  const recruiter = await collection.findOne({
    _id: new ObjectId(recruiterId),
    userId: new ObjectId(userId),
  });

  if (!recruiter) {
    throw new NotFoundError('Recruiter not found');
  }

  return recruiter;
}

export async function updateRecruiter(
  userId: string,
  recruiterId: string,
  data: Partial<Recruiter>
): Promise<Recruiter> {
  const collection = getRecruiterCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(recruiterId), userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Recruiter not found');
  }

  return result;
}

export async function updateRecruiterStatus(
  userId: string,
  recruiterId: string,
  newStatus: 'discovered' | 'connection_sent' | 'connected' | 'rejected',
  _notes?: string
): Promise<Recruiter> {
  const collection = getRecruiterCollection();
  const now = new Date();

  const updateData: any = {
    status: newStatus,
    updatedAt: now,
  };

  // Set timestamp based on status
  if (newStatus === 'connection_sent') {
    updateData.connectionSentAt = now;
    updateData.connectionWeek = startOfWeek(now);
  } else if (newStatus === 'connected') {
    updateData.connectedAt = now;
  } else if (newStatus === 'rejected') {
    updateData.rejectedAt = now;
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(recruiterId), userId: new ObjectId(userId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Recruiter not found');
  }

  return result;
}

export async function deleteRecruiter(
  userId: string,
  recruiterId: string
): Promise<void> {
  const collection = getRecruiterCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(recruiterId),
    userId: new ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Recruiter not found');
  }
}

export async function getWeeklyConnectionCount(userId: string): Promise<number> {
  const collection = getRecruiterCollection();
  const weekStart = startOfWeek();

  return collection.countDocuments({
    userId: new ObjectId(userId),
    connectionWeek: weekStart,
  });
}

export async function generateRecruiterMessages(
  userId: string,
  recruiterId: string,
  userProfile: {
    userSkills: string[];
    userExperience: string;
    language?: 'en' | 'pt';
  }
): Promise<Recruiter> {
  const collection = getRecruiterCollection();

  // Get recruiter
  const recruiter = await collection.findOne({
    _id: new ObjectId(recruiterId),
    userId: new ObjectId(userId),
  });

  if (!recruiter) {
    throw new NotFoundError('Recruiter not found');
  }

  // Generate messages
  const contactMessages = generateContactMessages({
    name: recruiter.name,
    company: recruiter.company,
    userSkills: userProfile.userSkills,
    userExperience: userProfile.userExperience,
    language: userProfile.language || 'en'
  });

  // Convert to GeneratedMessage format
  const generatedMessages: GeneratedMessage[] = contactMessages.map(msg => ({
    message: msg.message,
    generatedAt: new Date(),
    used: false
  }));

  // Update recruiter with generated messages
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(recruiterId), userId: new ObjectId(userId) },
    {
      $set: {
        generatedMessages,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Recruiter not found');
  }

  return result;
}
