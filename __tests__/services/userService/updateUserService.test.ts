import { IUserWithPassword, IUserWithID } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import { CustomError } from '@/utils/CustomError';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import bcrypt from 'bcryptjs';
import updateUserService from '@/services/userService/updateUserService';

jest.mock('@/orm/users/UsersModel');
jest.mock('bcryptjs');
jest.mock('@/utils/userValidations');

describe('updateUserService', () => {
  let userQuery: jest.Mocked<UserModel>;
  let user: IUserWithPassword;
  let currentUser: IUserWithID;

  beforeEach(() => {
    userQuery = new UserModel() as jest.Mocked<UserModel>;
    user = {
      email: 'newemail@example.com',
      password: 'currentPassword123',
      steamNick: 'newSteamNick',
      steamId: 'newSteamId',
      newPassword: 'newPassword123',
    };
    currentUser = {
      id: 1,
      email: 'currentemail@example.com',
      password: 'hashedCurrentPassword',
      steamNick: 'currentSteamNick',
      steamId: 'currentSteamId',
    };
  });

  it('should throw an error if the current password is incorrect', async () => {
    // Given
    userQuery.getUserById.mockResolvedValue(currentUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // When
    const updateUser = updateUserService(userQuery, user);

    // Then
    await expect(updateUser).rejects.toThrow(CustomError);
    await expect(updateUser).rejects.toThrow('Incorrect password');
  });

  it('should throw an error if the new email format is invalid', async () => {
    // Given
    userQuery.getUserById.mockResolvedValue(currentUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (isValidEmail as jest.Mock).mockReturnValue(false);

    // When
    const updateUser = updateUserService(userQuery, user);

    // Then
    await expect(updateUser).rejects.toThrow(CustomError);
    await expect(updateUser).rejects.toThrow('Invalid email format');
  });

  it('should throw an error if the new password format is invalid', async () => {
    // Given
    userQuery.getUserById.mockResolvedValue(currentUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (isValidEmail as jest.Mock).mockReturnValue(true);
    (isValidPassword as jest.Mock).mockReturnValue(false);

    // When
    const updateUser = updateUserService(userQuery, user);

    // Then
    await expect(updateUser).rejects.toThrow(CustomError);
    await expect(updateUser).rejects.toThrow('Invalid password format');
  });

  // it('should update the user successfully', async () => {
  //   // Given
  //   userQuery.getUserById.mockResolvedValue(currentUser);
  //   (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  //   (isValidEmail as jest.Mock).mockReturnValue(true);
  //   (isValidPassword as jest.Mock).mockReturnValue(true);
  //   (bcrypt.compare as jest.Mock).mockResolvedValue('hashedNewPassword');
  //   userQuery.updateUser.mockResolvedValue();

  //   // When
  //   await updateUserService(userQuery, user);

  //   // Then
  //   expect(userQuery.updateUser).toHaveBeenCalledWith({
  //     ...currentUser,
  //     email: user.email,
  //     password: 'hashedNewPassword',
  //     steamNick: user.steamNick,
  //     steamId: user.steamId,
  //   });
  // });
});
