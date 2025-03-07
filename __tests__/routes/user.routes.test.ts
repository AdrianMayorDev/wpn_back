import * as userController from '@/controllers/userController';
import * as authMiddle from '@/middlewares/authMiddleware';
import { app } from '@/server';
import request from 'supertest';

jest.mock('@/controllers/userController', () => ({
  getUserController: jest.fn((_req, res) => res.status(200).send('Mocked getUserController')),
  createUserController: jest.fn((_req, res) => res.status(201).send('Mocked createUserController')),
  updateUserController: jest.fn((_req, res) => res.status(200).send('Mocked updateUserController')),
  loginUserController: jest.fn((_req, res) => res.status(200).send('Mocked loginUserController')),
  deleteUserController: jest.fn((_req, res) => res.status(200).send('Mocked deleteUserController')),
}));

jest.mock('@/middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, _res, next) => {
    req.user = { id: 'mockUserId' };
    next();
  }),
}));

describe('User routes', () => {
  it('GET /user should trigger getUserController', async () => {
    const spy = jest.spyOn(userController, 'getUserController');
    await request(app).get('/user/1');
    expect(spy).toHaveBeenCalled();
  });

  it('POST /user should trigger createUserController', async () => {
    const spy = jest.spyOn(userController, 'createUserController');
    await request(app).post('/user');
    expect(spy).toHaveBeenCalled();
  });

  it('PUT /user should trigger updateUserController', async () => {
    const authSpy = jest.spyOn(authMiddle, 'authMiddleware');
    const controllerSpy = jest.spyOn(userController, 'updateUserController');
    await request(app).put('/user/');
    expect(authSpy).toHaveBeenCalled();
    expect(controllerSpy).toHaveBeenCalled();
  });

  it('POST /user/login should trigger loginUserController', async () => {
    const spy = jest.spyOn(userController, 'loginUserController');
    await request(app).post('/user/login');
    expect(spy).toHaveBeenCalled();
  });

  it('DELETE /user should trigger deleteUserController', async () => {
    const authSpy = jest.spyOn(authMiddle, 'authMiddleware');
    const controllerSpy = jest.spyOn(userController, 'deleteUserController');
    await request(app).delete('/user/');
    expect(authSpy).toHaveBeenCalled();
    expect(controllerSpy).toHaveBeenCalled();
  });
});
