import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import deleteUserService from '@/services/userService/deleteUserService';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';

jest.mock('@/DTO/usersModel/UsersModelDTO');
jest.mock('bcryptjs');

describe('deleteUserService', () => {
  let userQuery: jest.Mocked<UserModelDTO>;
  let password: string;
  let currentUser: { password: string };

  beforeEach(() => {
    userQuery = new UserModelDTO() as jest.Mocked<UserModelDTO>;
    password = 'password123';
    currentUser = {
      password: 'hashedPassword123',
    };
  });

  it('should throw an error if the password is incorrect', async () => {
    // Given
    userQuery.getUserById.mockResolvedValue({
      ...currentUser,
      userId: '1',
      email: 'test@example.com',
      steamNick: 'testNick',
      steamUserId: '123456789',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // When
    const deleteUser = deleteUserService(userQuery, password);

    // Then
    await expect(deleteUser).rejects.toThrow(CustomError);
    await expect(deleteUser).rejects.toThrow('Incorrect password');
  });

  it('should delete the user if the password is correct', async () => {
    // Given
    userQuery.getUserById.mockResolvedValue({
      ...currentUser,
      userId: '1',
      email: 'test@example.com',
      steamNick: 'testNick',
      steamUserId: '123456789',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    userQuery.deleteUser.mockResolvedValue();

    // When
    const result = await deleteUserService(userQuery, password);

    // Then
    expect(result).toBe('User deleted');
    // expect(userQuery.deleteUser).toHaveBeenCalled();
  });
});
