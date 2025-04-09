import { IUserLogin, IUserPayload, UserFields } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '@/config';
import UserModelDTO from '@/DTO/usersModel/UsersModelDTO';

const JWT_SECRET = config.JWT_SECRET;

async function loginUserService(userQuery: UserModelDTO, credentials: IUserLogin): Promise<JwtPayload> {
  const { email, password } = credentials;
  const fieldsToSelect = [UserFields.ID, UserFields.EMAIL, UserFields.PASSWORD];
  const user = await userQuery.getUserByEmail({ fieldsToSelect, email });

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }
  logger.info(`User ${user.email} found`);
  console.info(user);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid || !user) {
    throw new CustomError('Invalid email or password', 401);
  }

  if (!user.userId || !user.email) {
    logger.info(`User id: ${user.userId}, email: ${user.email} not found`);
    throw new CustomError('User not found', 404);
  }

  const payload: IUserPayload = { userId: user.userId, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });
  logger.info(`User ${user.email} logged in successfully`);

  return { token };
}

export default loginUserService;
