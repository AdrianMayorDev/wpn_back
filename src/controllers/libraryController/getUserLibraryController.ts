import { Request, Response, NextFunction } from 'express';
import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';

const getUserLibraryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    const service = new LibraryService();
    const userLibrary = await service.getUserLibrary(userId);

    logger.info(`Library fetched for userId: ${userId}`);
    res.status(200).json(createResponse('success', 'Library fetched', userLibrary));
  } catch (err) {
    next(err);
  }
};

export default getUserLibraryController;
