import { IUserData, IUserLogin, IUserWithID, IUserWithPassword } from '@/interfaces/userModel.interface';
import { JwtPayload } from 'jsonwebtoken';
import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import registerUserService from './userService/registerUserService';
import updateUserService from './userService/updateUserService';
import loginUserService from './userService/loginUserService';
import deleteUserService from './userService/deleteUserService';

interface IUserService {
  registerUser: (user: IUserWithPassword) => Promise<IUserData>;
  updateUser: (user: IUserWithPassword) => Promise<IUserWithID>;
  loginUser: (credentials: IUserLogin) => Promise<JwtPayload>;
  deleteUser: (password: string) => Promise<string>;
}

class UserService implements IUserService {
  private userQuery: UserModelDTO;

  private readonly registerService = registerUserService;
  private readonly updateService = updateUserService;
  private readonly loginService = loginUserService;
  private readonly deleteService = deleteUserService;

  constructor(userId?: string) {
    this.userQuery = new UserModelDTO(userId);
  }

  setUserId(userId: string) {
    this.userQuery = new UserModelDTO(userId);
  }

  async registerUser(user: IUserWithPassword): Promise<IUserData> {
    const response = await this.registerService(this.userQuery, user);
    return response;
  }

  async updateUser(user: IUserWithPassword) {
    const response = await this.updateService(this.userQuery, user);
    return response;
  }

  async loginUser(credentials: IUserLogin): Promise<JwtPayload> {
    const response = await this.loginService(this.userQuery, credentials);
    return response;
  }

  async deleteUser(password: string): Promise<string> {
    const response = await this.deleteService(this.userQuery, password);
    return response;
  }
}

export default UserService;
