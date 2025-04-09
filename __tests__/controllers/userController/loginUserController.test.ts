import { Request, Response, NextFunction } from 'express';
import UserService from '@/services/userService';
import { createResponse } from '@/utils/response';
import { loginUserController } from '@/controllers/userController';
import { CustomError } from '@/utils/CustomError';

// Mocks dependency
jest.mock('@/services/UserService');

describe('loginUserController suite', () => {
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

  it('Should return a 200 status code if login is successful', async () => {
    const mockToken = { token: 'mockToken' };
    const expectedResponse = createResponse('success', 'Login successful', mockToken);

    // Given
    req.body = { username: 'John Doe', email: 'john@example.com', password: 'P@sword123' };

    // When
    // Mock the service behavior
    if (req.userService) {
      req.userService.loginUser = jest.fn().mockResolvedValue(mockToken);
    }

    await loginUserController(req, res as Response, next);

    // Then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if email is not provided', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);

    // Given
    req.body = { username: 'John Doe', password: 'P@sword123' };

    // When
    await loginUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if password is not provided', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);

    // Given
    req.body = { username: 'John Doe', email: 'john@example.com' };

    // When
    await loginUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if email is not a string', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);

    // Given
    req.body = { email: 123, password: 'P@sword123' };

    // When
    await loginUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if password is not a string', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);

    // Given
    req.body = { email: 'john@example.com', password: 123 };

    // When
    await loginUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should call next with an error if the service throws an error', async () => {
    const expectedError = new Error('Service error');

    // Given
    req.body = { email: 'john@example.com', password: 'P@sword123' };

    // When
    if (req.userService) {
      req.userService.loginUser = jest.fn().mockRejectedValue(expectedError);
    }

    await loginUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedError);
  });
});
