import { config } from '@/config';
import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { IUserData, IUserPayload } from '@/interfaces/userModel.interface';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/CustomError';
import UserService from '@/services/userService';
// import '@mytypes/express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserData;
    userService?: UserService;
  }
}

const JWT_SECRET = config.JWT_SECRET;

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Extracting the token from the headers
    const { authorization } = req.headers;
    console.log('Authorization header:', authorization);
    if (!authorization) {
      throw new CustomError('Unauthorized', 401);
    }

    // Verifying the token
    const decoded = jwt.verify(authorization, JWT_SECRET) as IUserPayload;

    // Fetching the user by ID from the token payload
    const service = new UserModelDTO(decoded.userId);
    let user = await service.getUserById({});
    if (!user) {
      throw new CustomError('Unauthorized', 401);
    }

    user = { ...user, userId: decoded.userId, password: user.password ?? '' };

    req.user = user;
    req.userService = new UserService(decoded.userId);
    next();
  } catch (err) {
    next(err);
  }
};
