import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password }: Record<string, string> = req.body;
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

    const service = new UserService(id);
    const result = await service.deleteUser(password);

    logger.info(`User with id ${id} deleted`);
    res.status(200).json(createResponse('success', 'User deleted', result));
  } catch (err) {
    next(err);
  }
};

export default deleteUserController;
