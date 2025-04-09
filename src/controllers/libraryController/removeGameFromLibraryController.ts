import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const removeGameFromLibraryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;
    const { gameId } = req.body;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    if (!gameId || typeof gameId !== 'string') {
      throw new CustomError('Invalid game ID', 400);
    }

    const service = new LibraryService();
    await service.removeGameFromLibrary(userId, gameId);

    logger.info(`Game removed from library: ${gameId}`);
    res.status(200).json(createResponse('success', 'Game removed from library'));
  } catch (err) {
    next(err);
  }
};

export default removeGameFromLibraryController;
