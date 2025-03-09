import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { IUserBase, IUserWithID, UserFields } from '../../interfaces/userModel.interface';
import { BaseQuery } from '../base/baseQuery';

class UserModel extends BaseQuery<IUserWithID> {
  protected table = 'users';
  protected fields = UserFields;
  protected id;

  constructor(id?: number) {
    super();
    this.id = id ?? null;
  }

  getId(): number {
    return this.id ?? 0;
  }

  async getUserByEmail(email: string, selectFields?: string[]): Promise<IUserWithID | null> {
    const fields = [this.fields.ID, this.fields.EMAIL, this.fields.PASSWORD];
    const user = await this.getByField(selectFields ?? fields, 'email', email);

    return user;
  }

  async getUserById(selectFields?: string[]): Promise<IUserWithID> {
    const fields = [UserFields.ID, UserFields.EMAIL, UserFields.STEAMNICK];
    const user = await this.getById(selectFields ?? fields);

    if (!user) {
      throw new CustomError('User not found', 404);
    } else {
      logger.info(`User found: ${user.email}`);
      console.info(user);
      return user;
    }
  }

  async createNewUser(user: IUserBase): Promise<IUserWithID> {
    const response = await this.insert(user);
    return response;
  }

  async updateUser(user: IUserWithID): Promise<void> {
    await this.update(user);
  }

  async deleteUser(): Promise<void> {
    await this.delete();
  }
}

export { UserModel };
