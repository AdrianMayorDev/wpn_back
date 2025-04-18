import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const createGameStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;
    const { name } = req.body;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    if (!name || typeof name !== 'string') {
      throw new CustomError('Invalid status name', 400);
    }

    const service = new LibraryService();
    const response = await service.createGameStatus(userId, name);

    logger.info(`Game status created for userId: ${userId}`);
    res.status(201).json(createResponse('success', 'Game status created', response));
  } catch (err) {
    next(err);
  }
};

export default createGameStatusController;
