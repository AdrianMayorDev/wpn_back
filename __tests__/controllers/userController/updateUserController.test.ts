import UserService from '@/services/userService';
import { Request, Response, NextFunction } from 'express';
import { updateUserController } from '@/controllers/userController';
import { createResponse } from '@/utils/response';
import { IUserData } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';

jest.mock('@/services/userService');

describe('updateUserController suite', () => {
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

  it('Should return a 200 status code if user is updated', async () => {
    const mockUser: IUserData = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };
    const expectedResponse = createResponse('success', 'User updated', mockUser);

    // Given
    req.body = { steamNick: 'John Doe', email: 'john@example.com', password: 'P@sword123' };
    req.user = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };

    // When
    // Mock the service behavior
    if (req.userService) {
      req.userService.updateUser = jest.fn().mockResolvedValue(mockUser);
    }

    await updateUserController(req, res as Response, next);

    // Then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if password is not provided', async () => {
    const expectedResponse = new CustomError('Password field is required', 400);

    // Given
    req.body = { steamNick: 'John Doe', email: 'john@example.com' };
    req.user = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };

    // When
    await updateUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 400 if no field to change is provided', async () => {
    const expectedResponse = new CustomError(
      'At least one field (steamNick, email, or password) must be provided',
      400
    );

    // Given
    req.body = { password: 'P@sword123' };
    req.user = { userId: '1', steamNick: 'John Doe', steamUserId: '', email: 'john@example.com' };

    // When
    await updateUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedResponse);
  });

  it('Should return a 401 if user is not authenticated', async () => {
    const expectedResponse = new CustomError('Unauthorized', 401);

    // Given
    req.body = { password: 'P@sword123' };
    req.user = undefined;

    // When
    await updateUserController(req, res as Response, next);

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
      req.userService.updateUser = jest.fn().mockRejectedValue(expectedError);
    }

    await updateUserController(req, res as Response, next);

    // Then
    expect(next).toHaveBeenCalledWith(expectedError);
  });
});
