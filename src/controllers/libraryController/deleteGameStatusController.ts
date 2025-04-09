import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const deleteGameStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;
    const { gameStatusId } = req.body;

    if (!userId) throw new CustomError('Unauthorized', 401);
    if (!gameStatusId || typeof gameStatusId !== 'string') {
      throw new CustomError('Invalid game status ID', 400);
    }

    const service = new LibraryService();
    await service.deleteGameStatus(userId, gameStatusId);

    logger.info(`Game status deleted: ${gameStatusId}`);
    res.status(200).json(createResponse('success', 'Game status deleted'));
  } catch (err) {
    next(err);
  }
};

export default deleteGameStatusController;
