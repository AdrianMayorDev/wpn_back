import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: Record<string, string> = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const service = new UserService();
    const response = await service.loginUser({ email, password });

    logger.info(`User logged in: ${email}`);
    res.status(200).json(createResponse('success', 'Login successful', response));
  } catch (err) {
    next(err);
  }
};

export default loginUserController;
