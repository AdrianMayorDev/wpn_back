import { User } from '@/orm/users/Users';
import { CustomError } from '@/utils/CustomError';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
// import { logger } from '@/utils/logger';
import { IUserBase, IUserWithPassword, IUserWithID, UserFields } from '@/interfaces/user.interface';

export const registerUser = async (user: IUserWithPassword): Promise<IUserBase> => {
  const { email, password, username } = user;
  const userQuery = new User();
  const existingUser = await userQuery.getUserByEmail(email);

  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }

  if (!isValidEmail(email)) throw new CustomError('Invalid email format', 400);

  if (!isValidPassword(password)) throw new CustomError('Invalid password format', 400);

  const userToRegister = { email, password, username };
  const response = await userQuery.insert(userToRegister);
  return response;
};

export const updateUserData = async (user: IUserWithID): Promise<IUserBase> => {
  const { id, email, password, username } = user;
  const userQuery = new User(id);
  const selectFields = [UserFields.ALL];

  const currentUser = await userQuery.getById(selectFields);

  if (!currentUser) {
    throw new CustomError('User not found', 404);
  }

  const userToUpdate: IUserWithID = {
    id,
    email: email ?? currentUser.email,
    password: password ?? currentUser.password,
    username: username ?? currentUser.username,
  };

  if (!isValidEmail(userToUpdate.email)) throw new CustomError('Invalid email format', 400);

  if (!isValidPassword(userToUpdate.password)) throw new CustomError('Invalid password format', 400);

  const response = await userQuery.update(userToUpdate);
  return response;
};

export const getUserById = async (id: number): Promise<IUserBase> => {
  const userQuery = new User(id);
  const selectFields = [UserFields.EMAIL, UserFields.USERNAME, UserFields.ID];

  const user = await userQuery.getById(selectFields);

  if (!user) {
    throw new CustomError('User not found', 404);
  } else {
    return user;
  }
};

export const deleteUserData = () => {
  // Aquí iría la lógica para eliminar un usuario, por ejemplo, una eliminación en la base de datos.
  return 'User deleted';
};
