import { deleteUserData, registerUser, updateUserData } from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { createResponse } from '@/utils/response';
import type { NextFunction, Request, Response } from 'express';

// export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { userID } = req.params;
//     const userData = await findUserById(Number(userID));
//     if (userData) {
//       res.status(200).json(createResponse('success', 'User found', userData));
//     } else {
//       throw new CustomError('User not found', 404);
//     }
//   } catch (err) {
//     next(err);
//   }
// };

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password }: Record<string, string> = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const response = await registerUser({ username, email, password });
    res.status(201).json(createResponse('success', 'User created', response));
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { username, email, password }: Record<string, string> = req.body;
    const id = Number(userId);
    console.log('id', id, userId);

    if (isNaN(id)) {
      throw new CustomError('Invalid id field', 400);
    }

    if (!username && !email && !password) {
      throw new CustomError('At least one field (username, email, or password) must be provided', 400);
    }

    const result = await updateUserData({ id, username, email, password });
    res.status(200).json(createResponse('success', 'User updated', result));
  } catch (err) {
    next(err);
  }
};

export const deleteUserController = (req: Request, res: Response) => {
  const result = deleteUserData();
  res.send(result);
};
