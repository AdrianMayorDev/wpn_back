import { IUserWithID, UserFields } from '../../interfaces/user.interface';
import { BaseQuery } from '../base/baseQuery';

export class User extends BaseQuery<IUserWithID> {
  protected table = 'users';
  protected fields = UserFields;
  protected id;

  constructor(id?: number) {
    super();
    this.id = id ?? null;
  }

  async getUserByEmail(email: string): Promise<IUserWithID | null> {
    const selectFields = [this.fields.ID, this.fields.EMAIL, this.fields.PASSWORD];
    return await this.getByField(selectFields, 'email', email);
  }
}
