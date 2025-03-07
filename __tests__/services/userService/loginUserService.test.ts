import { IUserLogin, IUserWithID } from '@/interfaces/user.interface';
import { User } from '@/orm/users/Users';
import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@/orm/users/Users');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('User service loginUser', () => {
  let mockService: UserService;
  let mockUserQueries: Partial<User>;
  let mockCurrentUser: IUserWithID;

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock needed methods
    mockUserQueries = {
      getUserByEmail: jest.fn(),
    };

    (User as jest.Mock).mockImplementation(() => mockUserQueries);

    mockService = new UserService();

    // Simulate a current user
    mockCurrentUser = {
      id: 1,
      email: 'john@example.com',
      username: 'JohnDoe',
      password: 'hashedPassword',
    };
  });

  it('should login a user successfully', async () => {
    // Given
    const inputUser: IUserLogin = {
      email: 'john@example.com',
      password: 'P@ssword123',
    };

    const token = 'jwtToken';

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue(token);

    // Then
    const result = await mockService.loginUser(inputUser);

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(inputUser.password, mockCurrentUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockCurrentUser.id, email: mockCurrentUser.email },
      expect.any(String),
      { expiresIn: '3d' }
    );
    expect(result).toEqual({ token });
  });

  it('should throw an error if the user is not found', async () => {
    const expectedResponse = new CustomError('Invalid email or password', 401);
    // Given
    const inputUser: IUserLogin = {
      email: 'john@example.com',
      password: 'P@ssword123',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);

    // Then
    try {
      await mockService.loginUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw an error if the password is incorrect', async () => {
    const expectedResponse = new CustomError('Invalid email or password', 401);
    // Given
    const inputUser: IUserLogin = {
      email: 'john@example.com',
      password: 'incorrectPassword',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    // Then
    try {
      await mockService.loginUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(inputUser.password, mockCurrentUser.password);
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw an error if the user id or email is missing', async () => {
    const expectedResponse = new CustomError('User not found', 404);
    // Given
    const inputUser: IUserLogin = {
      email: 'john@example.com',
      password: 'P@ssword123',
    };

    const invalidUser = {
      ...mockCurrentUser,
      id: undefined,
      email: undefined,
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(invalidUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Then
    try {
      await mockService.loginUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(inputUser.password, mockCurrentUser.password);
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
