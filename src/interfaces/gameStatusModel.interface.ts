enum GameStatusFields {
  ALL = '*',
  GAME_STATUS_ID = 'game_status_id',
  NAME = 'name',
  USER_ID = 'user_id',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

interface IGameStatusData {
  gameStatusId?: number;
  name: string;
  userId: string;
}

interface IGameStatusDataDB {
  [GameStatusFields.GAME_STATUS_ID]: number;
  [GameStatusFields.NAME]: string;
  [GameStatusFields.USER_ID]: string;
  [GameStatusFields.CREATED_AT]: Date;
  [GameStatusFields.UPDATED_AT]: Date;
}

interface IGameStatusDataWithID extends Omit<IGameStatusData, 'gameStatusId' | 'name'> {
  gameStatusId: number;
  name?: string;
}

const gameStatusFieldMapping: Record<string, GameStatusFields> = {
  gameStatusId: GameStatusFields.GAME_STATUS_ID,
  name: GameStatusFields.NAME,
  userId: GameStatusFields.USER_ID,
  createdAt: GameStatusFields.CREATED_AT,
  updatedAt: GameStatusFields.UPDATED_AT,
};

const mapGameStatusToDbFields = (data: IGameStatusData): IGameStatusDataDB => {
  const mappedData: any = {} as IGameStatusDataDB;
  for (const key in data) {
    mappedData[gameStatusFieldMapping[key]] = data[key as keyof IGameStatusData];
  }
  return mappedData;
};

const mapGameStatusToModel = (data: IGameStatusDataDB): IGameStatusData => {
  const mappedData: any = {} as IGameStatusData;
  for (const key in data) {
    const modelKey = Object.keys(gameStatusFieldMapping).find((k) => gameStatusFieldMapping[k] === key);
    if (modelKey) {
      mappedData[modelKey] = data[key as keyof IGameStatusDataDB];
    }
  }
  return mappedData;
};

export {
  GameStatusFields,
  IGameStatusData,
  IGameStatusDataDB,
  IGameStatusDataWithID,
  mapGameStatusToDbFields,
  mapGameStatusToModel,
};
