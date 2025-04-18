import LibraryService from '@/services/libraryService';
import { CustomError } from '@/utils/CustomError';
import { createResponse } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';

const getAllStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError('Unauthorized', 401);
    }

    const { userId } = req.user;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    const service = new LibraryService();
    const allStatuses = await service.getAllStatus(userId);

    res.status(200).json(createResponse('success', 'All statuses retrieved', allStatuses));
  } catch (err) {
    next(err);
  }
};

export default getAllStatusController;
