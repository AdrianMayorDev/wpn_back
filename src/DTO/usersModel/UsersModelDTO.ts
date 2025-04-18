import { logger } from '@/utils/logger';
import {
  IUserData,
  IUserDataDB,
  IUserWithID,
  mapUserToDbFields,
  mapUserToModel,
  UserFields,
} from '../../interfaces/userModel.interface';
import BaseQuery from '../base/baseQuery';

class UserModelDTO extends BaseQuery<IUserWithID, IUserDataDB> {
  protected table = 'users';
  protected fields = UserFields;
  protected id;

  constructor(id?: string) {
    super();
    this.id = id ?? null;
  }

  protected mapToDbFields(data: IUserWithID): IUserDataDB {
    return mapUserToDbFields(data);
  }

  protected mapToModel(data: IUserDataDB): IUserWithID {
    return mapUserToModel(data) as IUserWithID;
  }

  getId(): string {
    return this.id ?? '';
  }

  async getUserByEmail({
    email,
    fieldsToSelect = [this.fields.EMAIL],
  }: {
    email: string;
    fieldsToSelect?: UserFields[];
  }): Promise<IUserWithID | null> {
    const keyField = this.fields.EMAIL;
    const values = [email];
    const user = await this.getByField({ fieldsToSelect, keyField, values });
    if (!user) return null;

    logger.debug(`User found: `, user);
    logger.info(`User found: ${user[0].email}`);

    return user[0];
  }

  async getUserById({
    fieldsToSelect = [this.fields.ID, this.fields.EMAIL, this.fields.STEAMNICK],
  }: {
    fieldsToSelect?: UserFields[];
  }) {
    const keyField = this.fields.ID;
    const values = [this.id ?? ''];

    const user = await this.getByField({ fieldsToSelect, keyField, values });

    if (!user) return null;

    logger.info(`User found: ${user[0].email}`);
    console.info(user);

    return user[0];
  }

  async createNewUser(user: IUserData) {
    logger.info(`Creating new user: ${user.email}`);
    console.info(user);
    const response = await this.insert(user);

    logger.info(`User created: ${user.email}`);

    return response;
  }

  async updateUser(user: IUserWithID) {
    const keyField = this.fields.ID;
    logger.info(`User to update: ${user.email}`);
    logger.debug(`User data: `, user);

    const data = {
      email: user.email,
      password: user.password,
      steamNick: user.steamNick,
      steamUserId: user.steamUserId,
    };
    const response = await this.update({ keyField, data, value: user.userId });

    // Remove the password property before returning the response
    response.password = '';
    return response;
  }

  async deleteUser() {
    const keyField = this.fields.ID;
    const value = this.id ?? '';
    await this.delete({ keyField, value });
    logger.info(`User deleted: ${this.id}`);
  }
}

export default UserModelDTO;
