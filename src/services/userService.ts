import { IUserBase, IUserLogin, IUserWithPassword } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import { JwtPayload } from 'jsonwebtoken';
import deleteUserService from './userService/deleteUserService';
import loginUserService from './userService/loginUserService';
import registerUserService from './userService/regsiterUserService';
import updateUserService from './userService/updateUserService';

class UserService {
  private readonly userQuery: UserModel;

  constructor(userId?: number) {
    this.userQuery = new UserModel(userId);
  }

  async registerUser(user: IUserWithPassword): Promise<IUserBase> {
    const response = await registerUserService(this.userQuery, user);
    return response;
  }

  async updateUser(user: IUserWithPassword) {
    await updateUserService(this.userQuery, user);
  }

  async loginUser(credentials: IUserLogin): Promise<JwtPayload> {
    const response = await loginUserService(this.userQuery, credentials);
    return response;
  }

  async deleteUser(password: string): Promise<string> {
    const response = await deleteUserService(this.userQuery, password);
    return response;
  }
}

export default UserService;
