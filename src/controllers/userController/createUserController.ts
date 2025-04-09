import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { steamNick, steamUserId, email, password }: Record<string, string> = req.body;
    const { userService } = req;

    if (!userService) {
      throw new CustomError('Internal server error', 500);
    }
    // Check if the input is valid
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const userData = { email, password, steamNick, steamUserId };

    // Register user
    const response = await userService.registerUser(userData);

    logger.info(`User created: ${response.email}`);
    res.status(201).json(createResponse('success', 'User created', response));
  } catch (err) {
    next(err);
  }
};

export default createUserController;
