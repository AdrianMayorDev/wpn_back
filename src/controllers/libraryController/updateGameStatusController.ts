import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const updateGameStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new CustomError('Unauthorized', 401);

    const { userId } = req.user;
    const { gameStatusId, name } = req.body;

    if (!userId) throw new CustomError('Unauthorized', 401);

    if (!gameStatusId || typeof gameStatusId !== 'string' || !name || typeof name !== 'string') {
      throw new CustomError('Invalid game status data', 400);
    }

    const service = new LibraryService();
    await service.updateGameStatus(userId, gameStatusId, name);

    logger.info(`Game status updated: ${gameStatusId}`);
    res.status(200).json(createResponse('success', 'Game status updated'));
  } catch (err) {
    next(err);
  }
};

export default updateGameStatusController;
