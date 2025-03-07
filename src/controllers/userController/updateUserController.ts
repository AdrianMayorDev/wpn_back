import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, newPassword, password }: Record<string, string> = req.body;
    const id = Number(req.user?.id);

    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    if (isNaN(id)) {
      throw new CustomError('Invalid id field', 400);
    }

    if (!password) {
      throw new CustomError('Password field is required', 400);
    }

    if (!username && !email && !newPassword) {
      throw new CustomError('At least one field (username, email, or password) must be provided', 400);
    }
    const service = new UserService(id);

    await service.updateUser({ username, email, newPassword, password });

    logger.info(`User updated: ${email}`);
    res.status(200).json(createResponse('success', 'User updated', null));
  } catch (err) {
    next(err);
  }
};

export default updateUserController;
