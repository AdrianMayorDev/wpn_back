import { IUserData } from '@/interfaces/userModel.interface';
import UserService from '@/services/userService';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserData;
    userService?: UserService;
  }
}
