import { IUserWithID, IUserWithPassword } from '@/interfaces/user.interface';
import { User } from '@/orm/users/Users';
import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';

jest.mock('@/orm/users/Users');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('User service updateUser', () => {
  let mockService: UserService;
  let mockUserQueries: Partial<User>;
  let mockCurrentUser: IUserWithID;

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock methods
    mockUserQueries = {
      getById: jest.fn(),
      getUserByEmail: jest.fn(),
      update: jest.fn(),
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

  it('should throw an error if the user is not found', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: 'john@example.com',
      password: 'password123',
      username: 'NewUser',
      newPassword: 'newPassword123',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(null);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('User not found', 404));
    }
  });

  it('should throw an error if the password is incorrect', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: 'john@example.com',
      password: 'incorrectPassword',
      username: 'NewUser',
      newPassword: 'newPassword123',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('Incorrect password', 400));
    }
  });

  it('should throw an error if the email format is invalid', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: 'invalid',
      password: 'P@ssword123',
      username: 'NewUser',
      newPassword: 'newPassword123',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('Invalid email format', 400));
    }
  });

  it('should throw an error if the email is already in use by another user', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: 'john2@example.com',
      password: 'password123',
      username: 'NewUser',
      newPassword: 'newPassword123',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue({ id: 2, email: 'john2@example.com' });

    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('Email already in use by another user', 409));
    }
  });

  it('should throw an error if the new email is already in use by the current user', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: 'john@example.com',
      password: 'P@ssword123',
      username: 'NewUser',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('This email is already in use by your account', 400));
    }
  });

  it('should throw an error if the password format is invalid', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: '',
      password: 'password123',
      username: 'NewUser',
      newPassword: 'invalidpassword',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);

    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('Invalid password format', 400));
    }
  });

  it('should throw an error if the username is already in use', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: '',
      password: 'P@ssword123',
      username: 'JohnDoe',
      newPassword: 'newP@ssword123',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Then
    try {
      await mockService.updateUser(inputUser);
    } catch (error) {
      expect(error).toEqual(new CustomError('Username already in use', 409));
    }
  });

  it('should update the user successfully', async () => {
    // Given
    const inputUser: IUserWithPassword = {
      email: 'john2@example.com',
      password: 'P@ssword123',
      username: 'NewUser',
      newPassword: 'newP@ssword123',
    };

    // When
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    mockUserQueries.getUserByEmail = jest.fn().mockResolvedValue(null);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    bcrypt.hash = jest.fn().mockResolvedValue('hashedNewPassword');

    const updatedUser: IUserWithID = {
      ...mockCurrentUser,
      email: 'john2@example.com',
      username: 'NewUser',
      password: 'hashedNewPassword',
    };

    mockUserQueries.update = jest.fn().mockResolvedValue(updatedUser); // Simula que el usuario es actualizado correctamente
    await mockService.updateUser(inputUser);

    // Then
    expect(mockUserQueries.update).toHaveBeenCalledWith(updatedUser);
  });
});
