import { ObjectId } from 'mongodb';
import { getAppointmentCollection, Appointment } from '../models/Appointment.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { validateStringLength } from '../utils/validation.js';

export async function createAppointment(
  userId: string,
  data: {
    title: string;
    description: string;
    type: 'interview' | 'study_session';
    startTime: Date;
    endTime: Date;
    allDay?: boolean;
    jobOpportunityId?: string;
    company?: string;
    location?: string;
    attendees?: string[];
  }
): Promise<Appointment> {
  // Validation
  const titleValidation = validateStringLength(data.title, 1, 200);
  if (!titleValidation.valid) {
    throw new ValidationError(`Title ${titleValidation.error}`);
  }

  if (data.startTime >= data.endTime) {
    throw new ValidationError('Start time must be before end time');
  }

  const now = new Date();
  const appointment: Appointment = {
    userId: new ObjectId(userId),
    title: data.title,
    description: data.description || '',
    type: data.type,
    startTime: data.startTime,
    endTime: data.endTime,
    allDay: data.allDay || false,
    source: 'manual',
    jobOpportunityId: data.jobOpportunityId ? new ObjectId(data.jobOpportunityId) : undefined,
    company: data.company,
    location: data.location,
    attendees: data.attendees,
    notificationSent: false,
    createdAt: now,
    updatedAt: now,
  };

  const collection = getAppointmentCollection();
  const result = await collection.insertOne(appointment);

  return { ...appointment, _id: result.insertedId };
}

export async function getAppointments(
  userId: string,
  filters?: { type?: string; startDate?: Date; endDate?: Date }
): Promise<Appointment[]> {
  const collection = getAppointmentCollection();
  const query: any = { userId: new ObjectId(userId) };

  if (filters?.type) {
    query.type = filters.type;
  }

  if (filters?.startDate || filters?.endDate) {
    query.startTime = {};
    if (filters.startDate) {
      query.startTime.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.startTime.$lte = filters.endDate;
    }
  }

  return collection.find(query).sort({ startTime: 1 }).toArray();
}

export async function getAppointmentById(
  userId: string,
  appointmentId: string
): Promise<Appointment> {
  const collection = getAppointmentCollection();
  const appointment = await collection.findOne({
    _id: new ObjectId(appointmentId),
    userId: new ObjectId(userId),
  });

  if (!appointment) {
    throw new NotFoundError('Appointment not found');
  }

  return appointment;
}

export async function updateAppointment(
  userId: string,
  appointmentId: string,
  data: Partial<Appointment>
): Promise<Appointment> {
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    throw new ValidationError('Start time must be before end time');
  }

  const collection = getAppointmentCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(appointmentId), userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Appointment not found');
  }

  return result;
}

export async function deleteAppointment(
  userId: string,
  appointmentId: string
): Promise<void> {
  const collection = getAppointmentCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(appointmentId),
    userId: new ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Appointment not found');
  }
}
