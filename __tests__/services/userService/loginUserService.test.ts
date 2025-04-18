import { IUserLogin, IUserPayload } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import loginUserService from '@/services/userService/loginUserService';
import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';

jest.mock('@/DTO/usersModel/UsersModelDTO');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('loginUserService', () => {
  let userQuery: jest.Mocked<UserModelDTO>;
  let credentials: IUserLogin;
  let user: IUserPayload;

  beforeEach(() => {
    userQuery = new UserModelDTO() as jest.Mocked<UserModelDTO>;
    credentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    user = {
      userId: '1',
      email: 'test@example.com',
      steamAvatar: 'avatar_url',
      steamUserId: '123456789',
    };
  });

  it('should throw an error if the email is not found', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue(null);

    // When
    const loginUser = loginUserService(userQuery, credentials);

    // Then
    await expect(loginUser).rejects.toThrow(CustomError);
    await expect(loginUser).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error if the password is incorrect', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue({
      ...user,
      password: 'hashedPassword',
      steamUserId: '123456789',
      steamNick: 'testNick',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // When
    const loginUser = loginUserService(userQuery, credentials);

    // Then
    await expect(loginUser).rejects.toThrow(CustomError);
    await expect(loginUser).rejects.toThrow('Invalid email or password');
  });

  it('should return a JWT token if the login is successful', async () => {
    // Given
    userQuery.getUserByEmail.mockResolvedValue({
      ...user,
      password: 'hashedPassword',
      steamUserId: '123456789',
      steamNick: 'testNick',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const token = 'jwt_token';
    (jwt.sign as jest.Mock).mockReturnValue(token);

    // When
    const result = await loginUserService(userQuery, credentials);

    // Then
    expect(result).toEqual({ token });
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: user.userId,
        email: user.email,
        steamAvatar: user.steamAvatar,
        steamUserId: user.steamUserId,
        steamNick: 'testNick',
      },
      'secret',
      {
        expiresIn: '3d',
      }
    );
  });
});
