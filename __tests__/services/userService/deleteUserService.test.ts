import { IUserWithID } from '@/interfaces/user.interface';
import { User } from '@/orm/users/Users';
import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';

jest.mock('@/orm/users/Users');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('User service deleteUser', () => {
  let mockService: UserService;
  let mockUserQueries: Partial<User>;
  let mockCurrentUser: IUserWithID;

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock methods
    mockUserQueries = {
      getById: jest.fn(),
      delete: jest.fn(),
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

  it('should delete a user successfully', async () => {
    // Given
    const password = 'P@ssword123';
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // When
    const result = await mockService.deleteUser(password);

    // Then
    expect(mockUserQueries.getById).toHaveBeenCalledWith(['password']);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockCurrentUser.password);
    expect(mockUserQueries.delete).toHaveBeenCalled();
    expect(result).toEqual('User deleted');
  });

  it('should throw an error if the user is not found', async () => {
    const expectedResponse = new CustomError('User not found', 404);
    // Given
    const password = 'P@ssword123';
    mockUserQueries.getById = jest.fn().mockResolvedValue(null);

    // When
    try {
      await mockService.deleteUser(password);
    } catch (error) {
      // Then
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getById).toHaveBeenCalledWith(['password']);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(mockUserQueries.delete).not.toHaveBeenCalled();
  });

  it('should throw an error if the password is incorrect', async () => {
    const expectedResponse = new CustomError('Incorrect password', 400);
    // Given
    const password = 'incorrectPassword';
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    // When
    try {
      await mockService.deleteUser(password);
    } catch (error) {
      // Then
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getById).toHaveBeenCalledWith(['password']);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockCurrentUser.password);
    expect(mockUserQueries.delete).not.toHaveBeenCalled();
  });
});
