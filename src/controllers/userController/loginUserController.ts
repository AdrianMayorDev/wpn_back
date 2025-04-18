import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { createResponse } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: Record<string, string> = req.body;
    const { userService } = req;
    console.log('email : ', email);
    console.log('password : ', password);
    if (!userService) {
      throw new CustomError('Internal server error', 500);
    }

    // Validating input
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Invalid input', 400);
    }

    const credentials = { email, password };

    // Logging in user
    const response = await userService.loginUser(credentials);

    logger.info(`User logged in: ${email}`);
    res.status(200).json(createResponse('success', 'Login successful', response));
  } catch (err) {
    next(err);
  }
};

export default loginUserController;
