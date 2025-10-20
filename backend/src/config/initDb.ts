import { createUserIndexes } from '../models/User.js';
import { createPostIdeaIndexes } from '../models/PostIdea.js';
import { createPostIndexes } from '../models/Post.js';
import { createJobOpportunityIndexes } from '../models/JobOpportunity.js';
import { createAppointmentIndexes } from '../models/Appointment.js';
import { createRecruiterIndexes } from '../models/Recruiter.js';
import { logger } from '../utils/logger.js';

export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Initializing database indexes...');

    await createUserIndexes();
    await createPostIdeaIndexes();
    await createPostIndexes();
    await createJobOpportunityIndexes();
    await createAppointmentIndexes();
    await createRecruiterIndexes();

    logger.info('✓ Database indexes created successfully');
  } catch (error) {
    logger.error('Failed to initialize database', { error });
    throw error;
  }
}
