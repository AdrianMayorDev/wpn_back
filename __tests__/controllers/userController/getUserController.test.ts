import { getUserController } from '@/controllers/userController';
import UserService from '@/services/userService';
import { CustomError } from '@/utils/CustomError';
import { createResponse } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';

// Mocks dependency
jest.mock('@/services/UserService');

describe('getUserController suite', () => {
  let req: Request;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('Should return a user if a valid userId is provided', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const expectedResponse = createResponse('success', 'User found', mockUser);
    // Given
    req.params = { userId: '1' };

    // When
    // Mock the service behavior
    (UserService as jest.Mock).mockImplementation(() => ({
      getUserById: jest.fn().mockResolvedValue(mockUser),
    }));

    await getUserController(req, res as Response, next);

    // Then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 error if userId is not provided', async () => {
    const expectedResponse = new CustomError('User id is required', 400);
    // Given
    req.params = {};

    // When
    await getUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 error if userId is not a number', async () => {
    // Given
    req.params = { userId: 'abc' };

    // When
    await getUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(new CustomError('User id is required', 400));
  });

  it('Should return a 404 error if the user does not exist', async () => {
    const expectedResponse = new CustomError('User not found', 404);
    // Given
    req.params = { userId: '1' };

    // When
    (UserService as jest.Mock).mockImplementation(() => ({
      getUserById: jest.fn().mockResolvedValue(null),
    }));

    await getUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });
});
