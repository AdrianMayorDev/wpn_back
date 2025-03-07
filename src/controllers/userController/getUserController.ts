import UserService from '../../services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId }: Record<string, string> = req.params;

    if (!userId || isNaN(Number(userId))) {
      throw new CustomError('User id is required', 400);
    }

    const id = Number(userId);
    const service = new UserService(id);
    const userData = await service.getUserById();
    console.info('userData', typeof userData);
    if (userData) {
      logger.info(`User found: ${userData.email}`);
      res.status(200).json(createResponse('success', 'User found', userData));
    } else {
      throw new CustomError('User not found', 404);
    }
  } catch (err) {
    next(err);
  }
};

export default getUserController;
