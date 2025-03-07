// import { User } from '@/orm/users/Users';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { CustomError } from '@/utils/CustomError';
// import UserService from '../../src/services/userService';

// // Mock external dependencies
// jest.mock('bcryptjs');
// jest.mock('jsonwebtoken');
// jest.mock('@/orm/users/Users');
// jest.mock('@/utils/logger');

// describe('UserService', () => {
//   let userService: UserService;
//   let mockUserQuery: jest.Mocked<User>;

//   beforeEach(() => {
//     // Reset the mocks before each test
//     mockUserQuery = new User(1) as jest.Mocked<User>;
//     userService = new UserService();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('registerUser', () => {
//     it('should successfully register a user', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//         username: 'testuser',
//       };

//       mockUserQuery.getUserByEmail.mockResolvedValue(null); // No existing user

//       (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

//       mockUserQuery.insert.mockResolvedValue(mockUser);

//       const result = await userService.registerUser(mockUser);

//       expect(result).toEqual(mockUser);
//       expect(mockUserQuery.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
//       expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
//     });

//     it('should throw an error if user already exists', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//         username: 'testuser',
//       };

//       mockUserQuery.getUserByEmail.mockResolvedValue(mockUser); // Existing user

//       await expect(userService.registerUser(mockUser)).rejects.toThrow(new CustomError('User already exists', 409));
//     });

//     it('should throw an error for invalid email format', async () => {
//       const mockUser = {
//         email: 'invalid-email',
//         password: 'password123',
//         username: 'testuser',
//       };

//       await expect(userService.registerUser(mockUser)).rejects.toThrow(new CustomError('Invalid email format', 400));
//     });
//   });

//   describe('updateUser', () => {
//     it('should successfully update user details', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//         username: 'testuser',
//       };

//       const updatedUser = {
//         email: 'new-email@example.com',
//         password: 'newpassword123',
//         username: 'newusername',
//       };

//       mockUserQuery.getById.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(true);
//       bcrypt.hash.mockResolvedValue('newHashedPassword');

//       mockUserQuery.update.mockResolvedValue(updatedUser);

//       await userService.updateUser({
//         ...updatedUser,
//         password: 'password123', // Current password
//       });

//       expect(mockUserQuery.update).toHaveBeenCalledWith({
//         ...mockUser,
//         email: updatedUser.email,
//         password: 'newHashedPassword',
//         username: updatedUser.username,
//       });
//     });

//     it('should throw an error if current password is incorrect', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//         username: 'testuser',
//       };

//       mockUserQuery.getById.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(false); // Invalid password

//       await expect(
//         userService.updateUser({
//           email: 'new-email@example.com',
//           password: 'wrongpassword',
//           username: 'newusername',
//           newPassword: 'newpassword123',
//         })
//       ).rejects.toThrow(new CustomError('Incorrect password', 400));
//     });
//   });

//   describe('loginUser', () => {
//     it('should successfully log in a user and return a token', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//         username: 'testuser',
//       };

//       mockUserQuery.getUserByEmail.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(true);

//       jwt.sign.mockReturnValue('mockJwtToken');

//       const result = await userService.loginUser({
//         email: 'test@example.com',
//         password: 'password123',
//       });

//       expect(result.token).toBe('mockJwtToken');
//       expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id, email: mockUser.email }, 'your_jwt_secret', {
//         expiresIn: '3d',
//       });
//     });

//     it('should throw an error if invalid credentials are provided', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//         username: 'testuser',
//       };

//       mockUserQuery.getUserByEmail.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(false); // Invalid password

//       await expect(
//         userService.loginUser({
//           email: 'test@example.com',
//           password: 'wrongpassword',
//         })
//       ).rejects.toThrow(new CustomError('Invalid email or password', 401));
//     });
//   });

//   describe('getUserById', () => {
//     it('should successfully fetch the user by ID', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         username: 'testuser',
//       };

//       mockUserQuery.getById.mockResolvedValue(mockUser);

//       const result = await userService.getUserById();

//       expect(result).toEqual(mockUser);
//     });

//     it('should throw an error if user not found', async () => {
//       mockUserQuery.getById.mockResolvedValue(null);

//       await expect(userService.getUserById()).rejects.toThrow(new CustomError('User not found', 404));
//     });
//   });

//   describe('deleteUser', () => {
//     it('should successfully delete the user', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//       };

//       mockUserQuery.getById.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(true);

//       mockUserQuery.delete.mockResolvedValue(undefined);

//       const result = await userService.deleteUser('password123');

//       expect(result).toBe('User deleted');
//       expect(mockUserQuery.delete).toHaveBeenCalled();
//     });

//     it('should throw an error if incorrect password is provided', async () => {
//       const mockUser = {
//         id: 1,
//         email: 'test@example.com',
//         password: 'password123',
//       };

//       mockUserQuery.getById.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(false); // Invalid password

//       await expect(userService.deleteUser('wrongpassword')).rejects.toThrow(new CustomError('Incorrect password', 400));
//     });
//   });
// });
