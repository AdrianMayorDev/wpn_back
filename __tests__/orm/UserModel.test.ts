import BaseQuery from '@/DTO/base/baseQuery';
import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { IUserDataDB, IUserWithID } from '@/interfaces/userModel.interface';

jest.mock('@/DTO/base/baseQuery');

describe('User ORM class', () => {
  let userInstance: UserModelDTO;
  let mockBaseQuery: Partial<BaseQuery<IUserWithID, IUserDataDB>>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockBaseQuery = {
      getByField: jest.fn(),
    };
    userInstance = new UserModelDTO('1');
  });

  it('should call getByField with correct parameters in getUserByEmail', async () => {
    // Given
    const email = 'john@example.com';
    const mockUser: IUserWithID = {
      userId: '1',
      email: 'john@example.com',
      steamNick: 'JohnDoe',
      steamUserId: '',
      password: 'hashedPassword',
    };

    mockBaseQuery.getByField = jest.fn().mockResolvedValue([mockUser]);
    (userInstance as any).getByField = mockBaseQuery.getByField;

    // When
    const result = await userInstance.getUserByEmail({ email });

    // Then
    expect(mockBaseQuery.getByField).toHaveBeenCalledWith({
      fieldsToSelect: ['email'],
      keyField: 'email',
      values: ['john@example.com'],
    });
    expect(result).toEqual(mockUser);
  });

  it('should return null if user is not found in getUserByEmail', async () => {
    // Given
    const email = 'nonexistent@example.com';

    mockBaseQuery.getByField = jest.fn().mockResolvedValue(null);
    (userInstance as any).getByField = mockBaseQuery.getByField;

    // When
    const result = await userInstance.getUserByEmail({ email });

    // Then
    expect(mockBaseQuery.getByField).toHaveBeenCalledWith({
      fieldsToSelect: ['email'],
      keyField: 'email',
      values: ['nonexistent@example.com'],
    });
    expect(result).toBeNull();
  });
});
