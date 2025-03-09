import { IUserBase, IUserPayload } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/CustomError';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';

// Extending the Request interface to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserBase;
  }
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Extracting the token from the headers
    const { authorization } = req.headers;
    if (!authorization) {
      throw new CustomError('Unauthorized', 401);
    }

    // Verifying the token
    const decoded = jwt.verify(authorization, JWT_SECRET) as IUserPayload;

    // Fetching the user by ID from the token payload
    const service = new UserModel(decoded.id);
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
