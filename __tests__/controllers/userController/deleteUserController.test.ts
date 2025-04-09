import UserService from '@/services/userService';
import { Request, Response, NextFunction } from 'express';
import { deleteUserController } from '@/controllers/userController';
import { createResponse } from '@/utils/response';
import { CustomError } from '@/utils/CustomError';

jest.mock('@/services/UserService');

describe('deleteUserController suite', () => {
  let req: Request;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      userService: new UserService(),
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('Should return a 200 status code if user is deleted successfully', async () => {
    const mockUser = null;
    const expectedResponse = createResponse('success', 'User deleted', mockUser);

    // Given
    req.body = { password: 'P@sword123' };
    req.user = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };

    // When
    // Mock the service behavior
    if (req.userService) {
      req.userService.deleteUser = jest.fn().mockResolvedValue(mockUser);
    }

    await deleteUserController(req, res as Response, next);

    // Then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if password is not provided', async () => {
    const expectedResponse = new CustomError('Password field is required', 400);

    // Given
    req.body = {};
    req.user = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example' };

    // When
    await deleteUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 401 if user is not authenticated', async () => {
    const expectedResponse = new CustomError('Unauthorized', 401);

    // Given
    req.body = { password: 'P@sword123' };
    req.user = undefined;

    // When
    await deleteUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should call next with an error if the service throws an error', async () => {
    const expectedError = new Error('Service error');

    // Given
    req.body = { email: 'john@example.com', password: 'P@sword123' };
    req.user = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };

    // When
    if (req.userService) {
      req.userService.deleteUser = jest.fn().mockRejectedValue(expectedError);
    }

    await deleteUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedError);
  });
});
