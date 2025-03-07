import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password }: Record<string, string> = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const service = new UserService();
    const response = await service.registerUser({ username, email, password });

    logger.info(`User created: ${response.email}`);
    res.status(201).json(createResponse('success', 'User created', response));
  } catch (err) {
    next(err);
  }
};

export default createUserController;
