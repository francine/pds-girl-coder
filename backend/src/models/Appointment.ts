import { ObjectId, Collection } from 'mongodb';
import { getDB } from '../config/database.js';

export interface Appointment {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description: string;
  type: 'interview' | 'study_session';
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  source: 'manual' | 'icalendar';
  externalEventId?: string;
  icalendarUrl?: string;
  jobOpportunityId?: ObjectId;
  company?: string;
  notificationSent: boolean;
  notificationSentAt?: Date;
  location?: string;
  attendees?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function getAppointmentCollection(): Collection<Appointment> {
  return getDB().collection<Appointment>('appointments');
}

export async function createAppointmentIndexes(): Promise<void> {
  const collection = getAppointmentCollection();
  await collection.createIndex({ userId: 1, startTime: 1 });
  await collection.createIndex({ userId: 1, type: 1, startTime: 1 });
  await collection.createIndex({ startTime: 1 });
  await collection.createIndex(
    { externalEventId: 1, icalendarUrl: 1 },
    { unique: true, sparse: true }
  );
}
