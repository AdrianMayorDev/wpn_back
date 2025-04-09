import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId }: Record<string, string> = req.params;

    // Validating user id
    if (!userId) {
      throw new CustomError('User id is required', 400);
    }

    const userModel = new UserModelDTO(userId);

    // Fetching user data
    const userData = await userModel.getUserById({});

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
