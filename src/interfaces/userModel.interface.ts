enum UserFields {
  ALL = '*',
  ID = 'id',
  STEAMNICK = 'steamNick',
  STEAMID = 'steamId',
  EMAIL = 'email',
  PASSWORD = 'password',
}

interface IUserBase {
  id?: number;
  steamNick: string;
  steamId: string;
  email: string;
  newPassword?: string;
  table?: string;
}

interface IUserWithPassword extends IUserBase {
  password: string;
}

interface IUserWithID extends Omit<IUserWithPassword, 'id'> {
  id: number;
}

interface IUserPayload {
  id: number;
  email: string;
}

interface IUserLogin extends Omit<IUserWithPassword, 'id' | 'steamId' | 'steamNick'> {}

export { UserFields, IUserBase, IUserWithPassword, IUserWithID, IUserPayload, IUserLogin };
