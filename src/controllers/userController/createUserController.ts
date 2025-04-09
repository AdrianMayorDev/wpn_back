import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { steamNick, steamId, email, password }: Record<string, string> = req.body;

    // Check if the input is valid
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const userData = { email, password, steamNick, steamId };
    const service = new UserService();

    // Register user
    const response = await service.registerUser(userData);

    logger.info(`User created: ${response.email}`);
    res.status(201).json(createResponse('success', 'User created', response));
  } catch (err) {
    next(err);
  }
};

export default createUserController;
