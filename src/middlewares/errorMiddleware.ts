import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/CustomError';
import { createResponse } from '@/utils/response';
import { logger } from '@/utils/logger';

export const errorMiddleware = (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  logger.error(err.stack ?? message);
  res.status(statusCode).json(createResponse('error', message, null));
};
