// import type { Request, Response, NextFunction } from 'express';

// export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
//   console.error(err.stack);
//   res.status(500).send({ error: 'Something went wrong!' });
// };

import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
};
