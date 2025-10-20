import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import authRouter from './api/auth.js';
import postIdeasRouter from './api/postIdeas.js';
import postsRouter from './api/posts.js';
import jobOpportunitiesRouter from './api/jobOpportunities.js';
import appointmentsRouter from './api/appointments.js';
import recruitersRouter from './api/recruiters.js';
import linkedinRouter from './api/linkedin.js';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
  });
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post-ideas', postIdeasRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/opportunities', jobOpportunitiesRouter);
app.use('/api/v1/appointments', appointmentsRouter);
app.use('/api/v1/recruiters', recruitersRouter);
app.use('/api/v1/linkedin', linkedinRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
