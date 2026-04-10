import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const getGameController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gameId } = req.params;

    if (!gameId || typeof gameId !== 'string') {
      throw new CustomError('Invalid game ID', 400);
    }

    const service = new LibraryService();
    const game = await service.getGame(gameId);

    logger.info(`Game retrieved: ${gameId}`);
    res.status(200).json(createResponse('success', 'Game retrieved', game));
  } catch (err) {
    next(err);
  }
};

export default getGameController;
