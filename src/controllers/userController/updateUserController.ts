import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { steamNick, steamId, email, newPassword, password }: Record<string, string> = req.body;
    const id = Number(req.user?.id);

    // Check if the user is authenticated
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    // Validating user id
    if (isNaN(id)) {
      throw new CustomError('Invalid id field', 400);
    }

    // Validating password field
    if (!password) {
      throw new CustomError('Password field is required', 400);
    }

    // Check if at least one field is provided
    if (!steamNick && !email && !newPassword) {
      throw new CustomError('At least one field (steamNick, email, or password) must be provided', 400);
    }

    const userData = { email, password, steamNick, steamId };
    const service = new UserService(id);

    // Updating user
    await service.updateUser(userData);

    logger.info(`User updated: ${email}`);
    res.status(200).json(createResponse('success', 'User updated', null));
  } catch (err) {
    next(err);
  }
};

export default updateUserController;
