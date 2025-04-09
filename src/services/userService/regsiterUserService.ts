import { IUserBase, IUserWithPassword } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import bcrypt from 'bcryptjs';

const registerUserService = async (userQuery: UserModel, user: IUserWithPassword): Promise<IUserBase> => {
  const { email, password, steamNick, steamId } = user;
  logger.info(`email: ${email}, password: ${password}, steamNick: ${steamNick}`);

  const existingUser = await userQuery.getUserByEmail(email);

  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }

  if (!isValidEmail(email)) {
    throw new CustomError('Invalid email format', 400);
  }

  if (!steamNick || !steamId) {
    throw new CustomError('Steam Nick and Steam ID are required', 400);
  }
  // const checkSteamId = await this.userQuery.getSteamIdBySteamNick(steamNick);

  // if (checkSteamId && checkSteamId !== steamId) {
  //   throw new CustomError("Steam ID doesn't match the Steam Nick", 400);
  // }

  if (!isValidPassword(password)) {
    throw new CustomError('Invalid password format', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // const hashedSteamId = await bcrypt.hash(steamId, 10);
  // const hashedSteamNick = await bcrypt.hash(steamNick, 10);
  // const hashedEmail = await bcrypt.hash(email, 10);

  // const userToRegister = { email: hashedEmail, password: hashedPassword, steamNick: hashedSteamNick, steamId: hashedSteamId };
  const userToRegister = { email, password: hashedPassword, steamNick, steamId };
  const response = await userQuery.createNewUser(userToRegister);
  return response;
};

export default registerUserService;
