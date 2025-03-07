import { User } from '@/orm/users/Users';
import { IUserWithID, UserFields } from '@/interfaces/user.interface';
import { BaseQuery } from '@/orm/base/baseQuery';

jest.mock('@/orm/base/baseQuery');

describe('User ORM class', () => {
  let userInstance: User;
  let mockBaseQuery: Partial<BaseQuery<IUserWithID>>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockBaseQuery = {
      getByField: jest.fn(),
    };
    userInstance = new User(1);
  });

  it('should initialize with the correct id', () => {
    expect(userInstance.getId()).toBe(1);
  });

  it('should call getByField with correct parameters in getUserByEmail', async () => {
    // Given
    const email = 'john@example.com';
    const mockUser: IUserWithID = {
      id: 1,
      email: 'john@example.com',
      username: 'JohnDoe',
      password: 'hashedPassword',
    };

    mockBaseQuery.getByField = jest.fn().mockResolvedValue(mockUser);
    (userInstance as any).getByField = mockBaseQuery.getByField;

    // When
    const result = await userInstance.getUserByEmail(email);

    // Then
    expect(mockBaseQuery.getByField).toHaveBeenCalledWith(
      [UserFields.ID, UserFields.EMAIL, UserFields.PASSWORD],
      'email',
      email
    );
    expect(result).toEqual(mockUser);
  });

  it('should return null if user is not found in getUserByEmail', async () => {
    // Given
    const email = 'nonexistent@example.com';

    mockBaseQuery.getByField = jest.fn().mockResolvedValue(null);
    (userInstance as any).getByField = mockBaseQuery.getByField;

    // When
    const result = await userInstance.getUserByEmail(email);

    // Then
    expect(mockBaseQuery.getByField).toHaveBeenCalledWith(
      [UserFields.ID, UserFields.EMAIL, UserFields.PASSWORD],
      'email',
      email
    );
    expect(result).toBeNull();
  });
});
