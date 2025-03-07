import { IUserWithPassword } from '@/interfaces/user.interface';
import { User } from '@/orm/users/Users';
import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';

jest.mock('@/orm/users/Users');
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation(() => 'hashedPassword'),
}));

describe('User service register user', () => {
  let mockService: UserService;
  let mockUserQueries: Partial<User>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockUserQueries = {
      getUserByEmail: jest.fn(),
      insert: jest.fn(),
    };

    (User as jest.Mock).mockImplementation(() => mockUserQueries);

    mockService = new UserService();
  });

  it('should register a user successfully', async () => {
    const resultUserQuery: IUserWithPassword = {
      username: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };

    // Given
    const inputUser: IUserWithPassword = {
      username: 'John Doe',
      email: 'john@example.com',
      password: 'P@ssword123',
    };

    const inputUserHashed: IUserWithPassword = {
      ...inputUser,
      password: 'hashedPassword',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(inputUserHashed.password);
    mockUserQueries.insert = jest
      .fn()
      .mockImplementation(async (resultUserQuery) => await Promise.resolve(resultUserQuery));

    // Then
    const result = await mockService.registerUser(inputUser);

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(inputUser.password, 10);
    expect(mockUserQueries.insert).toHaveBeenCalledWith(inputUserHashed);
    expect(result).toEqual(resultUserQuery);
  });

  it('should throw an error if user already exists', async () => {
    const expectedResponse = new CustomError('User already exists', 409);
    // Given
    const inputUser: IUserWithPassword = {
      username: 'John Doe',
      email: 'john Doe',
      password: 'P@ssword123',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(inputUser);

    // Then
    try {
      await mockService.registerUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUserQueries.insert).not.toHaveBeenCalled();
  });

  it('should throw an error if email is invalid', async () => {
    const expectedResponse = new CustomError('Invalid email format', 400);
    // Given
    const inputUser: IUserWithPassword = {
      username: 'John Doe',
      email: 'john Doe',
      password: 'P@ssword123',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);

    // Then
    try {
      await mockService.registerUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUserQueries.insert).not.toHaveBeenCalled();
  });

  it('should throw an error if password is invalid', async () => {
    const expectedResponse = new CustomError('Invalid password format', 400);
    // Given
    const inputUser: IUserWithPassword = {
      username: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);

    // Then
    try {
      await mockService.registerUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUserQueries.insert).not.toHaveBeenCalled();
  });

  it('should throw an error if bcrypt hash fails', async () => {
    const expectedResponse = new CustomError('Error hashing password', 500);
    // Given
    const inputUser: IUserWithPassword = {
      username: 'John Doe',
      email: 'john@example.com',
      password: 'P@ssword123',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockRejectedValue(new Error('Error hashing password'));

    // Then
    try {
      await mockService.registerUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(inputUser.password, 10);
    expect(mockUserQueries.insert).not.toHaveBeenCalled();
  });

  it('should throw an error if user query insert fails', async () => {
    const expectedResponse = new CustomError('Error inserting data', 500);
    // Given
    const inputUser: IUserWithPassword = {
      username: 'John Doe',
      email: 'john@email.com',
      password: 'P@ssword123',
    };

    // When
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedPassword');
    mockUserQueries.insert = jest.fn().mockRejectedValue(new Error('Error inserting data'));

    // Then
    try {
      await mockService.registerUser(inputUser);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getUserByEmail).toHaveBeenCalledWith(inputUser.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(inputUser.password, 10);
    expect(mockUserQueries.insert).toHaveBeenCalledWith({
      username: inputUser.username,
      email: inputUser.email,
      password: 'hashedPassword',
    });
  });
});
