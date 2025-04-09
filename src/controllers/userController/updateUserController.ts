import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { steamNick, steamUserId, email, newPassword, password }: Record<string, string> = req.body;
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

    // Check if at least one field is provided
    if (!steamNick && !email && !newPassword) {
      throw new CustomError('At least one field (steamNick, email, or password) must be provided', 400);
    }

    const userData = { email, password, steamNick, steamUserId };

    // userService.setUserId(userId);
    // Updating user
    const response = await userService.updateUser(userData);

    logger.info(`User updated: ${email}`);
    res.status(200).json(createResponse('success', 'User updated', response));
  } catch (err) {
    next(err);
  }
};

export default updateUserController;
