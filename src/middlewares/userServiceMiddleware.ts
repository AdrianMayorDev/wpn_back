import { config } from '@/config';
import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { IUserData, IUserPayload } from '@/interfaces/userModel.interface';
import UserService from '@/services/userService';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    userService?: UserService;
    user?: IUserData;
  }
}

const JWT_SECRET = config.JWT_SECRET;

export const userServiceMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    console.log('Authorization header 2:', authorization);

    let decoded;
    let user;

    if (authorization) {
      decoded = jwt.verify(authorization, JWT_SECRET) as IUserPayload;
      const service = new UserModelDTO(decoded.userId);
      user = await service.getUserById({});
    }

    req.user = user ?? undefined;
    req.userService = new UserService(decoded?.userId);

    next();
  } catch (err) {
    next(err);
  }
};
