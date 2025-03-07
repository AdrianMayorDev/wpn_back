import getConnection from '@/orm/base/getConnection';
import { BaseQuery } from '@/orm/base/baseQuery';

jest.mock('@/orm/base/getConnection');

interface IUserWithID {
  id: number;
  email: string;
  username: string;
  password: string;
}

class UserQuery extends BaseQuery<IUserWithID> {
  protected table = 'users';
  protected id: number | null;

  constructor(id?: number) {
    super();
    this.id = id ?? null;
  }
}

describe('BaseQuery class', () => {
  let userQuery: UserQuery;
  let mockConnection: any;

  beforeEach(() => {
    jest.resetAllMocks();
    userQuery = new UserQuery(1);

    mockConnection = {
      execute: jest.fn(),
      release: jest.fn(),
    };

    (getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  it('should insert data successfully', async () => {
    // Given
    const data = { email: 'john@example.com', username: 'JohnDoe', password: 'hashedPassword' };
    const result = { insertId: 1 };
    mockConnection.execute.mockResolvedValue([result]);

    // When
    const insertedData = await userQuery.insert(data);

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      ['john@example.com', 'JohnDoe', 'hashedPassword']
    );
    expect(insertedData).toEqual({ id: 1, ...data });
  });

  it('should update data successfully', async () => {
    // Given
    const data = { email: 'john@example.com', username: 'JohnDoe' };
    const result = { insertId: 1 };
    mockConnection.execute.mockResolvedValue([result]);

    // When
    const updatedData = await userQuery.update(data);

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith('UPDATE users SET email = ?, username = ? WHERE id = ?', [
      'john@example.com',
      'JohnDoe',
      1,
    ]);
    expect(updatedData).toEqual({ id: 1, ...data });
  });

  it('should delete data successfully', async () => {
    // When
    await userQuery.delete();

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
  });

  it('should get data by id successfully', async () => {
    // Given
    const selectFields = ['id', 'email', 'username'];
    const rows = [{ id: 1, email: 'john@example.com', username: 'JohnDoe' }];
    mockConnection.execute.mockResolvedValue([rows]);

    // When
    const result = await userQuery.getById(selectFields);

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith('SELECT id, email, username FROM users WHERE id = ?', [1]);
    expect(result).toEqual(rows[0]);
  });

  it('should return null if data not found by id', async () => {
    // Given
    const selectFields = ['id', 'email', 'username'];
    mockConnection.execute.mockResolvedValue([[]]);

    // When
    const result = await userQuery.getById(selectFields);

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith('SELECT id, email, username FROM users WHERE id = ?', [1]);
    expect(result).toBeNull();
  });

  it('should get data by field successfully', async () => {
    // Given
    const selectFields = ['id', 'email', 'username'];
    const field = 'email';
    const value = 'john@example.com';
    const rows = [{ id: 1, email: 'john@example.com', username: 'JohnDoe' }];
    mockConnection.execute.mockResolvedValue([rows]);

    // When
    const result = await userQuery.getByField(selectFields, field, value);

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith('SELECT id, email, username FROM users WHERE email = ?', [
      'john@example.com',
    ]);
    expect(result).toEqual(rows[0]);
  });

  it('should return null if data not found by field', async () => {
    // Given
    const selectFields = ['id', 'email', 'username'];
    const field = 'email';
    const value = 'nonexistent@example.com';
    mockConnection.execute.mockResolvedValue([[]]);

    // When
    const result = await userQuery.getByField(selectFields, field, value);

    // Then
    expect(mockConnection.execute).toHaveBeenCalledWith('SELECT id, email, username FROM users WHERE email = ?', [
      'nonexistent@example.com',
    ]);
    expect(result).toBeNull();
  });
});
