export enum UserFields {
  ALL = '*',
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  PASSWORD = 'password',
}

export interface IUserBase {
  id?: number;
  username: string;
  email: string;
  table?: string;
}

export interface IUserWithPassword extends IUserBase {
  password: string;
}

export interface IUserWithID extends Omit<IUserWithPassword, 'id'> {
  id: number;
}
