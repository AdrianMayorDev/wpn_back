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
  newPassword?: string;
}

export interface IUserWithPassword extends IUserBase {
  password: string;
}

export interface IUserWithID extends Omit<IUserWithPassword, 'id'> {
  id: number;
}

export interface IUserPayload {
  id: number;
  email: string;
}

export interface IUserLogin extends Omit<IUserWithPassword, 'username' | 'id'> {}
