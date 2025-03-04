import { deleteUserData, findUserById, registerUser, updateUserData } from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { createResponse } from '@/utils/response';
import type { NextFunction, Request, Response } from 'express';

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.params;
    const userData = await findUserById(Number(userID));
    if (userData) {
      res.status(200).json(createResponse('success', 'User found', userData));
    } else {
      throw new CustomError('User not found', 404);
    }
  } catch (err) {
    next(err);
  }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email }: { name: string; email: string } = req.body;
    const response = await registerUser(name, email);
    res.status(201).json(createResponse('success', 'User created', response));
  } catch (err) {
    next(err);
  }
};

export const updateUserController = (req: Request, res: Response) => {
  const result = updateUserData();
  res.send(result);
};

export const deleteUserController = (req: Request, res: Response) => {
  const result = deleteUserData();
  res.send(result);
};
