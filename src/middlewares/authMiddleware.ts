import { IUserBase, IUserPayload } from '@/interfaces/user.interface';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/CustomError';
import UserService from '@/services/userService';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserBase;
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new CustomError('Unauthorized', 401);
    }

    const decoded = jwt.verify(authorization, JWT_SECRET) as IUserPayload;

    const service = new UserService(decoded.id);
    let user = await service.getUserById();

    user = { ...user, id: decoded.id };

    if (!user) {
      throw new CustomError('Unauthorized', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
