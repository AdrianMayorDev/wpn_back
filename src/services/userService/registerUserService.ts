import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { IUserData, IUserWithPassword } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import LibraryService from '../libraryService';

export interface IRegisterUserService {
  register: (userQuery: UserModelDTO, user: IUserWithPassword) => Promise<IUserData>;
}

const registerUserService = async (userQuery: UserModelDTO, user: IUserWithPassword): Promise<IUserData> => {
  const { email, password, steamNick, steamUserId } = user;
  logger.info(`Registering user: ${email}`);

  const existingUser = await userQuery.getUserByEmail({ email });

  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }

  if (!isValidEmail(email)) {
    throw new CustomError('Invalid email format', 400);
  }

  if (!steamNick || !steamUserId) {
    throw new CustomError('Steam Nick and Steam ID are required', 400);
  }

  if (!isValidPassword(password)) {
    throw new CustomError('Invalid password format', 400);
  }

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const userToRegister = { userId, email, password: hashedPassword, steamNick, steamUserId };
  const response = await userQuery.createNewUser(userToRegister);

  const defaultGameStatus = 'Pending';
  await new LibraryService().createGameStatus(userId, defaultGameStatus);
  logger.info(`User registered successfully: ${email}`);

  return response;
};

export default registerUserService;
