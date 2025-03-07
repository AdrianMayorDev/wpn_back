import { IUserWithID } from '@/interfaces/user.interface';
import { User } from '@/orm/users/Users';
import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';

jest.mock('@/orm/users/Users');

describe('User service getUserById', () => {
  let mockService: UserService;
  let mockUserQueries: Partial<User>;
  let mockCurrentUser: IUserWithID;

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock de los métodos necesarios
    mockUserQueries = {
      getById: jest.fn(),
    };

    (User as jest.Mock).mockImplementation(() => mockUserQueries);

    mockService = new UserService();

    // Simulación de un usuario actual
    mockCurrentUser = {
      id: 1,
      email: 'john@example.com',
      username: 'JohnDoe',
      password: 'hashedPassword',
    };
  });

  it('should return a user successfully', async () => {
    // Given
    const selectFields = ['id', 'email', 'username'];
    mockUserQueries.getById = jest.fn().mockResolvedValue(mockCurrentUser);

    // When
    const result = await mockService.getUserById();

    // Then
    expect(mockUserQueries.getById).toHaveBeenCalledWith(selectFields);
    expect(result).toEqual(mockCurrentUser);
  });

  it('should throw an error if the user is not found', async () => {
    const expectedResponse = new CustomError('User not found', 404);
    // Given
    mockUserQueries.getById = jest.fn().mockResolvedValue(null);

    // When
    try {
      await mockService.getUserById();
    } catch (error) {
      // Then
      expect(error).toEqual(expectedResponse);
    }

    expect(mockUserQueries.getById).toHaveBeenCalledWith(['id', 'email', 'username']);
  });
});
