import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { IUserWithPassword } from '@/interfaces/userModel.interface';
import registerUserService from '@/services/userService/regsiterUserService';
import { CustomError } from '@/utils/CustomError';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import bcrypt from 'bcryptjs';

jest.mock('@/DTO/usersModel/UsersModelDTO');
jest.mock('@/services/libraryService');
jest.mock('@/utils/userValidations');
jest.mock('bcryptjs');
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('registerUserService', () => {
  let userQuery: jest.Mocked<UserModelDTO>;
  let user: IUserWithPassword;

  beforeEach(() => {
    userQuery = new UserModelDTO() as jest.Mocked<UserModelDTO>;
    user = {
      email: 'test@example.com',
      password: 'P@ssw0rd',
      steamNick: 'testNick',
      steamUserId: '123456789',
    };
  });

  it('should throw an error if user already exists', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue({ ...user, userId: '1' });

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
    userQuery.createNewUser.mockResolvedValue({ ...user, userId: '1' });

    // When
    const result = await registerUserService(userQuery, user);

    // Then
    expect(result).toEqual({ ...user, userId: '1' });
  });
});
