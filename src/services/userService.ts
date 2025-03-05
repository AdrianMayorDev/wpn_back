import { User } from '@/orm/users/Users';
import { CustomError } from '@/utils/CustomError';
import { isValidEmail, isValidPassword } from '@/utils/userValidations';
import {
  IUserBase,
  IUserWithPassword,
  IUserWithID,
  UserFields,
  IUserPayload,
  IUserLogin,
} from '@/interfaces/user.interface';
import { logger } from '@/utils/logger';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';

class UserService {
  private readonly userQuery: User;

  constructor(userId?: number) {
    this.userQuery = new User(userId);
  }

  async registerUser(user: IUserWithPassword): Promise<IUserBase> {
    const { email, password, username } = user;
    logger.info(`email: ${email}, password: ${password}, username: ${username}`);

    const existingUser = await this.userQuery.getUserByEmail(email);

    if (existingUser) {
      throw new CustomError('User already exists', 409);
    }

    if (!isValidEmail(email)) {
      throw new CustomError('Invalid email format', 400);
    }

    if (!isValidPassword(password)) {
      throw new CustomError('Invalid password format', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userToRegister = { email, password: hashedPassword, username };
    const response = await this.userQuery.insert(userToRegister);
    return response;
  }

  async updateUser(user: IUserWithPassword) {
    const { email: newEmail, password, username: newUsername, newPassword } = user;

    const selectFields = [UserFields.ALL];
    const currentUser = await this.userQuery.getById(selectFields);

    if (!currentUser) {
      throw new CustomError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordValid) {
      throw new CustomError('Incorrect password', 400);
    }

    if (newEmail) {
      if (!isValidEmail(newEmail)) {
        logger.info(`Invalid email format: ${newEmail}`);
        throw new CustomError('Invalid email format', 400);
      }

      if (newEmail === currentUser.email) {
        throw new CustomError('This email is already in use by your account', 400);
      }

      const existingEmailUser = await this.userQuery.getUserByEmail(newEmail);
      if (existingEmailUser?.id !== currentUser.id) {
        throw new CustomError('Email already in use by another user', 409);
      }
    }

    if (newPassword && !isValidPassword(newPassword)) {
      logger.info(`Invalid password format: ${password}`);
      throw new CustomError('Invalid password format', 400);
    }

    if (newUsername && newUsername === currentUser.username) {
      throw new CustomError('Username already in use', 409);
    }

    const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : currentUser.password;

    const userToUpdate: IUserWithID = {
      ...currentUser,
      email: newEmail ?? currentUser.email,
      password: hashedPassword,
      username: newUsername ?? currentUser.username,
    };

    await this.userQuery.update(userToUpdate);
  }

  async loginUser({ email, password }: IUserLogin): Promise<JwtPayload> {
    const user = await this.userQuery.getUserByEmail(email);

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
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

  async getUserById(): Promise<IUserBase> {
    const selectFields = [UserFields.ID, UserFields.EMAIL, UserFields.USERNAME];
    const user = await this.userQuery.getById(selectFields);

    if (!user) {
      throw new CustomError('User not found', 404);
    } else {
      return user;
    }
  }

  async deleteUser(password: string): Promise<string> {
    const selectFields = [UserFields.PASSWORD];
    const currentUser = await this.userQuery.getById(selectFields);

    if (!currentUser) {
      throw new CustomError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordValid) {
      throw new CustomError('Incorrect password', 400);
    }
    await this.userQuery.delete();
    return 'User deleted';
  }
}

export default UserService;
