enum LibraryFields {
  ALL = '*',
  USER_ID = 'user_id',
  GAME_ID = 'game_id',
  STATUS_ID = 'game_status_id',
  ADDED_AT = 'added_at',
  UPDATED_AT = 'updated_at',
  MANUAL_INDEX = 'manual_index',
}

interface ILibraryDataDB {
  [LibraryFields.USER_ID]: string;
  [LibraryFields.GAME_ID]: string;
  [LibraryFields.STATUS_ID]: number;
  [LibraryFields.ADDED_AT]?: Date;
  [LibraryFields.UPDATED_AT]?: Date;
  [LibraryFields.MANUAL_INDEX]?: number;
}

interface ILibraryData {
  userId: string;
  gameId: string;
  gameStatusId: number;
  addedAt?: Date;
  updatedAt?: Date;
  manualIndex?: number;
}

const libraryFieldMapping: Record<string, LibraryFields> = {
  userId: LibraryFields.USER_ID,
  gameId: LibraryFields.GAME_ID,
  gameStatusId: LibraryFields.STATUS_ID,
  addedAt: LibraryFields.ADDED_AT,
  updatedAt: LibraryFields.UPDATED_AT,
  manualIndex: LibraryFields.MANUAL_INDEX,
};

function mapLibraryToDbFields(data: ILibraryData): ILibraryDataDB {
  const mappedData: any = {};
  for (const key in data) {
    if (libraryFieldMapping[key]) {
      mappedData[libraryFieldMapping[key]] = data[key as keyof ILibraryData];
    }
  }
  return mappedData;
}

function mapLibraryToModel(data: ILibraryDataDB): ILibraryData {
  const mappedData: any = {};
  for (const key in data) {
    const modelKey = Object.keys(libraryFieldMapping).find((k) => libraryFieldMapping[k] === key);
    if (modelKey) {
      mappedData[modelKey] = data[key as keyof ILibraryDataDB];
    }
  }
  return mappedData;
}

export { LibraryFields, ILibraryData, ILibraryDataDB, mapLibraryToModel, mapLibraryToDbFields };
