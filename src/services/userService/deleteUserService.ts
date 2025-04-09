import { UserFields } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import { CustomError } from '@/utils/CustomError';
import bcrypt from 'bcryptjs';

async function deleteUserService(userQuery: UserModel, password: string): Promise<string> {
  const selectFields = [UserFields.PASSWORD];
  const currentUser = await userQuery.getUserById(selectFields);

  const isPasswordValid = await bcrypt.compare(password, currentUser.password);
  if (!isPasswordValid) {
    throw new CustomError('Incorrect password', 400);
  }
  await userQuery.deleteUser();
  return 'User deleted';
}

export default deleteUserService;
