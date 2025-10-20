import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    logger.warn('Application error', {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
      path: req.path,
    });

    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  // Unknown error
  logger.error('Unexpected error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
  });

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}
