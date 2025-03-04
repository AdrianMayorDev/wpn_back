import type { Request, Response } from 'express';
import {
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '@/controllers/userController';
import * as userService from '@/services/userService';

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });
    res = {
      json: jsonMock,
      send: sendMock,
      status: statusMock,
    };
  });

  it('should get user data', () => {
    req.params = { userID: '123' };
    const mockUserData = 'User data for userID: 123';
    jest.spyOn(userService, 'getUserData').mockReturnValue(mockUserData);

    getUserController(req as Request, res as Response);

    expect(userService.getUserData).toHaveBeenCalledWith('123');
    expect(res.send).toHaveBeenCalledWith(mockUserData);
  });

  it('should create user data', () => {
    const mockCreateResult = 'User created';
    jest.spyOn(userService, 'createUserData').mockReturnValue(mockCreateResult);

    createUserController(req as Request, res as Response);

    expect(userService.createUserData).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockCreateResult);
  });

  it('should update user data', () => {
    const mockUpdateResult = 'User updated';
    jest.spyOn(userService, 'updateUserData').mockReturnValue(mockUpdateResult);

    updateUserController(req as Request, res as Response);

    expect(userService.updateUserData).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockUpdateResult);
  });

  it('should delete user data', () => {
    const mockDeleteResult = 'User deleted';
    jest.spyOn(userService, 'deleteUserData').mockReturnValue(mockDeleteResult);

    deleteUserController(req as Request, res as Response);

    expect(userService.deleteUserData).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockDeleteResult);
  });
});
