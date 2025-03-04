import { User } from '@/orm/users/Users';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';

export async function registerUser(name: string, email: string) {
  if (typeof name !== 'string' || typeof email !== 'string') {
    throw new CustomError('Invalid input', 400);
  }

  const response = await User.create(name, email);
  return response;
}

export async function findUserById(id: number): Promise<User | null> {
  return await User.findById(id);
}

export const updateUserData = () => {
  logger('Updating user');
  // Aquí iría la lógica para actualizar un usuario, por ejemplo, una actualización en la base de datos.
  return 'User updated';
};

export const deleteUserData = () => {
  logger('Deleting user');
  // Aquí iría la lógica para eliminar un usuario, por ejemplo, una eliminación en la base de datos.
  return 'User deleted';
};
