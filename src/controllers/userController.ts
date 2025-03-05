import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId }: Record<string, string> = req.params;
    const id = Number(userId);
    const service = new UserService(id);
    const userData = await service.getUserById();

    if (userData) {
      res.status(200).json(createResponse('success', 'User found', userData));
    } else {
      throw new CustomError('User not found', 404);
    }
  } catch (err) {
    next(err);
  }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password }: Record<string, string> = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }
    const service = new UserService();
    const response = await service.registerUser({ username, email, password });
    res.status(201).json(createResponse('success', 'User created', response));
  } catch (err) {
    next(err);
  }
};

export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: Record<string, string> = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const service = new UserService();
    const response = await service.loginUser({ email, password });
    res.status(200).json(createResponse('success', 'Login successful', { response }));
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, newPassword, password }: Record<string, string> = req.body;
    const id = Number(req.user?.id);

    logger.info(`Invalid id: ${req.user?.id}`);
    if (isNaN(id)) {
      throw new CustomError('Invalid id field', 400);
    }

    if (!password) {
      throw new CustomError('Password field is required', 400);
    }

    if (!username && !email && !newPassword) {
      throw new CustomError('At least one field (username, email, or password) must be provided', 400);
    }
    const service = new UserService(id);

    await service.updateUser({ username, email, newPassword, password });
    res.status(200).json(createResponse('success', 'User updated', null));
  } catch (err) {
    next(err);
  }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password }: Record<string, string> = req.body;
    const id = Number(req.user?.id);

    if (isNaN(id)) {
      throw new CustomError('Invalid id field', 400);
    }

    if (!password) {
      throw new CustomError('Password field is required', 400);
    }

    const service = new UserService(id);
    const result = await service.deleteUser(password);
    res.status(200).json(createResponse('success', 'User deleted', result));
  } catch (err) {
    next(err);
  }
};
