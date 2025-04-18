import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const assignGameStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;
    const { gameId, gameStatusId } = req.body;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    if (!gameId || typeof gameId !== 'string' || !gameStatusId || typeof gameStatusId !== 'string') {
      throw new CustomError('Invalid game or status ID', 400);
    }

    const service = new LibraryService();
    await service.assignGameStatusToGame(userId, gameId, gameStatusId);

    logger.info(`Game status assigned: ${gameStatusId} to game: ${gameId}`);
    res.status(200).json(createResponse('success', 'Game status assigned'));
  } catch (err) {
    next(err);
  }
};

export default assignGameStatusController;
