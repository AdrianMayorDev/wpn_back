import { createUserController } from '@/controllers/userController';
import { Request, Response, NextFunction } from 'express';
import UserService from '@/services/userService';
import { createResponse } from '@/utils/response';
import { CustomError } from '@/utils/CustomError';
import { IUserData } from '@/interfaces/userModel.interface';

// Mocks dependency
jest.mock('@/services/UserService');
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('createUserController suite', () => {
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

  it('Should return a 201 status code if a user is created', async () => {
    const mockUser: IUserData = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };
    const expectedResponse = createResponse('success', 'User created', mockUser);
    // Given
    req.body = { username: 'John Doe', email: 'john@example.com', password: 'P@sword123' };

    // When
    // Mock the service behavior
    if (req.userService) {
      req.userService.registerUser = jest.fn().mockResolvedValue(mockUser);
    }

    await createUserController(req, res as Response, next);

    // Then
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if email is not provided', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);
    // Given
    req.body = { username: 'John Doe', password: 'P@sword123' };

    // When
    await createUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if password is not provided', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);
    // Given
    req.body = { username: 'John Doe', email: 'john@example.com' };

    // When
    await createUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if email is not a string', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);
    // Given
    req.body = { username: 'John Doe', email: 123, password: 'P@sword123 JEJE' };

    // When
    await createUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if password is not a string', async () => {
    const expectedResponse = new CustomError('Invalid input', 400);
    // Given
    req.body = { username: 'John Doe', email: 'john@example.com', password: 123 };

    // When
    await createUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should call next with an error if the service throws an error', async () => {
    // Given
    req.body = { username: 'John Doe', email: 'john@example.com', password: 'P@sword123' };
    const expectedError = new Error('Service error');
    // When
    if (req.userService) {
      console.log('Mocking userService.updateUser is defined');
      req.userService.registerUser = jest.fn().mockRejectedValue(expectedError);
    }

    await createUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(new Error('Service error'));
  });
});
