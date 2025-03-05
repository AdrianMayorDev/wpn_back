// import { logger } from '@/utils/logger';
// import { deleteUserData, findUserById, registerUser, updateUserData } from '../userService';

// // Mocke logger function to avoid console logs
// jest.mock('@/utils/logger');

// describe('User Service', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should get user data', () => {
//     const userID = 1;
//     const result = findUserById(userID);
//     expect(result).toBe(`User data for userID: ${userID}`);
//     expect(logger).toHaveBeenCalledWith(`Fetching user data for userID: ${userID}`);
//   });

//   it('should create user data', () => {
//     const name = 'John Doe';
//     const email = 'email@email.com';
//     const password = 'P@ssword123';
//     const result = registerUser(name, email, password);
//     expect(result).toBe('User created');
//     expect(logger).toHaveBeenCalledWith('Creating user');
//   });

//   it('should update user data', () => {
//     const result = updateUserData();
//     expect(result).toBe('User updated');
//     expect(logger).toHaveBeenCalledWith('Updating user');
//   });

//   it('should delete user data', () => {
//     const result = deleteUserData();
//     expect(result).toBe('User deleted');
//     expect(logger).toHaveBeenCalledWith('Deleting user');
//   });
// });
