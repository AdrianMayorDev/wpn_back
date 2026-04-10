import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password }: Record<string, string> = req.body;
    const { userService } = req;

    if (!userService) {
      throw new CustomError('Internal server error', 500);
    }

    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    // Validating password field
    if (!password) {
      throw new CustomError('Password field is required', 400);
    }

    // Deleting user
    const result = await userService.deleteUser(password);

    logger.info(`User with id ${userId} deleted`);
    res.status(200).json(createResponse('success', 'User deleted', result));
  } catch (err) {
    next(err);
  }
};

export default deleteUserController;
