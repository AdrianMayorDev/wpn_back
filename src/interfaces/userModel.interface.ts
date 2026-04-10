enum UserFields {
  ALL = '*',
  ID = 'user_id',
  STEAMNICK = 'steam_nick',
  STEAMUSERID = 'steam_user_id',
  EMAIL = 'email',
  PASSWORD = 'password',
  AVATAR = 'avatar_url',
}

interface IUserData {
  userId?: string;
  steamNick: string;
  steamUserId: string;
  email: string;
  newPassword?: string;
  table?: string;
}

interface IUserDataDB {
  [UserFields.ID]: string;
  [UserFields.STEAMNICK]: string;
  [UserFields.STEAMUSERID]: string;
  [UserFields.EMAIL]: string;
  [UserFields.PASSWORD]: string;
  [UserFields.AVATAR]: string;
}

interface IUserWithPassword extends IUserData {
  password: string;
}

interface IUserWithID extends Omit<IUserWithPassword, 'userId'> {
  userId: string;
}

interface IUserPayload {
  userId: string;
  email: string;
}

const userFieldMapping: Record<string, string> = {
  userId: UserFields.ID,
  steamNick: UserFields.STEAMNICK,
  steamUserId: UserFields.STEAMUSERID,
  email: UserFields.EMAIL,
  password: UserFields.PASSWORD,
  avatar: UserFields.AVATAR,
};

const mapUserToDbFields = (data: IUserData): IUserDataDB => {
  const mappedData: any = {};
  for (const key in data) {
    if (userFieldMapping[key]) {
      mappedData[userFieldMapping[key]] = data[key as keyof IUserData];
    }
  }
  return mappedData;
};

const mapUserToModel = (data: IUserDataDB): IUserData => {
  const mappedData: any = {} as IUserData;
  for (const key in data) {
    const modelKey = Object.keys(userFieldMapping).find((k) => userFieldMapping[k] === key);
    if (modelKey) {
      mappedData[modelKey] = data[key as keyof IUserDataDB];
    }
  }
  return mappedData;
};

interface IUserLogin extends Omit<IUserWithPassword, 'userId' | 'steamUserId' | 'steamNick'> {}

export {
  UserFields,
  IUserData,
  IUserWithPassword,
  IUserWithID,
  IUserPayload,
  IUserLogin,
  IUserDataDB,
  mapUserToModel,
  mapUserToDbFields,
};
