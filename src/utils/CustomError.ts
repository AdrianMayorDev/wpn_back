import { logger } from './logger';

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, err?: Error) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    logger.error(`CustomError: ${message} (Status code: ${statusCode})`);
    if (err) {
      logger.error(`Error: ${err.message}`);
    }
  }
}
