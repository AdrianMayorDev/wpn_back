import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { CustomError } from '@/utils/CustomError';

const getGameStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { gameId } = req.body;
    const { userId } = req.user;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    if (!gameId || typeof gameId !== 'string') {
      throw new CustomError('Invalid game ID', 400);
    }

    const service = new LibraryService();
    const gameStatus = await service.getGameStatus(userId, gameId);

    logger.info(`Game status retrieved: ${gameId}`);
    res.status(200).json(createResponse('success', 'Game status retrieved', gameStatus));
  } catch (err) {
    next(err);
  }
};

export default getGameStatusController;
