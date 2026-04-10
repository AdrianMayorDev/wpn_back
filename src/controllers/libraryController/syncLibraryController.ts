import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const syncLibraryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId, email } = req.user;

    if (!userId || !email) {
      throw new CustomError('Unauthorized', 401);
    }

    logger.info(`Received sync request from user: ${email} with userId: ${userId}`);

    const { steamNick, steamId } = req.body;

    if (typeof steamNick !== 'string' || typeof steamId !== 'string') {
      throw new CustomError('Invalid steamNick or steamId', 400);
    }

    logger.info(`Starting library sync for userId: ${userId}, steamNick: ${steamNick}, steamId: ${steamId}`);

    const service = new LibraryService();

    await service.syncLibrary({ userId, steamNick, steamId });

    logger.info(`Library sync completed for userId: ${userId}`);
    res.status(201).json(createResponse('success', 'Library created'));
  } catch (err) {
    next(err);
  }
};

export default syncLibraryController;
