import { IUserWithPassword } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import registerUserService from '@/services/userService/regsiterUserService';
import { CustomError } from '@/utils/CustomError';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import bcrypt from 'bcryptjs';

jest.mock('@/orm/users/UsersModel');
jest.mock('@/utils/userValidations');
jest.mock('bcryptjs');

describe('registerUserService', () => {
  let userQuery: jest.Mocked<UserModel>;
  let user: IUserWithPassword;

  beforeEach(() => {
    userQuery = new UserModel() as jest.Mocked<UserModel>;
    user = {
      email: 'test@example.com',
      password: 'P@ssw0rd',
      steamNick: 'testNick',
      steamId: '123456789',
    };
  });

  it('should throw an error if user already exists', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue({ ...user, id: 1 });

    // When
    const result = registerUserService(userQuery, user);

    // Then
    await expect(result).rejects.toThrow(new CustomError('User already exists', 409));
  });

  it('should throw an error if email format is invalid', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue(null);
    (isValidEmail as jest.Mock).mockReturnValue(false);

    // When
    const result = registerUserService(userQuery, user);

    // Then
    await expect(result).rejects.toThrow(new CustomError('Invalid email format', 400));
  });

  it('should throw an error if Steam Nick or Steam ID is missing', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue(null);
    (isValidEmail as jest.Mock).mockReturnValue(true);
    user.steamNick = '';

    // When
    const result = registerUserService(userQuery, user);

    // Then
    await expect(result).rejects.toThrow(new CustomError('Steam Nick and Steam ID are required', 400));
  });

  it('should throw an error if password format is invalid', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue(null);
    (isValidEmail as jest.Mock).mockReturnValue(true);
    (isValidPassword as jest.Mock).mockReturnValue(false);

    // When
    const result = registerUserService(userQuery, user);

    // Then
    await expect(result).rejects.toThrow(new CustomError('Invalid password format', 400));
  });

  it('should successfully register a user', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue(null);
    (isValidEmail as jest.Mock).mockReturnValue(true);
    (isValidPassword as jest.Mock).mockReturnValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    userQuery.createNewUser.mockResolvedValue({ ...user, id: 1 });

    // When
    const result = await registerUserService(userQuery, user);

    // Then
    expect(result).toEqual({ ...user, id: 1 });
  });
});
