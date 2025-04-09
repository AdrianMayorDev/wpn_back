import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { IUserWithID, IUserWithPassword, UserFields } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import bcrypt from 'bcryptjs';

const updateUserService = async (userQuery: UserModelDTO, user: IUserWithPassword) => {
  const { email: newEmail, password, steamNick: newSteamNick, steamUserId, newPassword } = user;

  const fieldsToSelect = [UserFields.ALL];
  const currentUser = await userQuery.getUserById({ fieldsToSelect });

  if (!currentUser) {
    throw new CustomError('User not found', 404);
  }

  // if (newSteamNick) {
  //   if (newSteamNick === currentUser.steamNick) {
  //     throw new CustomError('This Steam Nick is already in use by your account', 409);
  //   }

  //   const checkSteamId = await userQuery.getSteamIdBySteamNick(newSteamNick);

  //   if (checkSteamId && checkSteamId !== steamId) {
  //     throw new CustomError("Steam ID doesn't match the Steam Nick", 400);
  //   }
  // }

  // Validating current password
  const isPasswordValid = await bcrypt.compare(password, currentUser.password);

  if (!isPasswordValid) {
    throw new CustomError('Incorrect password', 400);
  }

  // Validating and updating email
  if (newEmail) {
    if (!isValidEmail(newEmail)) {
      logger.info(`Invalid email format: ${newEmail}`);
      throw new CustomError('Invalid email format', 400);
    }

    if (newEmail === currentUser.email) {
      throw new CustomError('This email is already in use by your account', 400);
    }

    logger.info(`Checking if email ${newEmail} is already in use by another user`);
    const fieldsToSelect = [UserFields.EMAIL, UserFields.ID];
    const existingEmailUser = await userQuery.getUserByEmail({ fieldsToSelect, email: newEmail });
    console.info(`Existing user: `, existingEmailUser);
    if (existingEmailUser && existingEmailUser.userId !== currentUser.userId) {
      throw new CustomError('Email already in use by another user', 409);
    }
  }

  // Validating and updating new password
  if (newPassword && !isValidPassword(newPassword)) {
    logger.info(`Invalid password format: ${password}`);
    throw new CustomError('Invalid password format', 400);
  }

  const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : currentUser.password;

  // Preparing user data to update
  const userToUpdate: IUserWithID = {
    ...currentUser,
    userId: currentUser.userId,
    email: newEmail ?? currentUser.email,
    password: hashedPassword,
    steamNick: newSteamNick ?? currentUser.steamNick,
    steamUserId: steamUserId ?? currentUser.steamUserId,
  };

  logger.debug(`User to update: `, userToUpdate);

  // Updating user
  const response = await userQuery.updateUser(userToUpdate);
  return response;
};
export default updateUserService;
