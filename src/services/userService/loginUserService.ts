import { IUserLogin, IUserPayload } from '@/interfaces/userModel.interface';
import { UserModel } from '@/orm/users/UsersModel';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';

async function loginUserService(userQuery: UserModel, credentials: IUserLogin): Promise<JwtPayload> {
  const { email, password } = credentials;
  const user = await userQuery.getUserByEmail(email);

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid || !user) {
    throw new CustomError('Invalid email or password', 401);
  }

  if (!user.id || !user.email) {
    logger.info(`User id: ${user.id}, email: ${user.email} not found`);
    throw new CustomError('User not found', 404);
  }

  const payload: IUserPayload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });
  logger.info(`User ${user.email} logged in successfully`);

  return { token };
}

export default loginUserService;
