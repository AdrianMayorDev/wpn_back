import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';
import { UserFields } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';

export interface IDeleteUserService {
  delete: (userQuery: UserModelDTO, password: string) => Promise<string>;
}

async function deleteUserService(userQuery: UserModelDTO, password: string): Promise<string> {
  const fieldsToSelect = [UserFields.PASSWORD];
  const currentUser = await userQuery.getUserById({ fieldsToSelect });

  if (!currentUser) {
    throw new CustomError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(password, currentUser.password);
  if (!isPasswordValid) {
    throw new CustomError('Incorrect password', 400);
  }
  await userQuery.deleteUser();
  return 'User deleted';
}

export default deleteUserService;
