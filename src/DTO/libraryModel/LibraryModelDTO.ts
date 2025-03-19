import {
  ILibraryData,
  ILibraryDataDB,
  LibraryFields,
  mapLibraryToDbFields,
  mapLibraryToModel,
} from '@/interfaces/libraryModel.interface';
import { logger } from '@/utils/logger';
import { BaseQuery } from '../base/baseQuery';

class LibraryModelDTO extends BaseQuery<ILibraryData, ILibraryDataDB> {
  protected table = 'library';
  protected fields = LibraryFields;
  protected id;

  constructor(id?: string) {
    super();
    this.id = id ?? null;
  }

  protected mapToDbFields(data: ILibraryData): ILibraryDataDB {
    return mapLibraryToDbFields(data);
  }

  protected mapToModel(data: ILibraryDataDB): ILibraryData {
    return mapLibraryToModel(data);
  }

  async getGameInUserLibrary({
    userId,
    gameId,
  }: {
    userId: string;
    gameId: string;
  }): Promise<Partial<ILibraryData> | null> {
    const fieldsToSelect = [this.fields.GAME_ID];
    const keyFields = [this.fields.USER_ID, this.fields.GAME_ID];
    const values = [userId, gameId];
    const game = await this.getByManyFields({ fieldsToSelect, keyFields, values });

    if (!game) return null;

    logger.info(`Game found in library: ${game.gameId}`);
    console.info(game);

    return game;
  }

  async addManyGamesToLibrary(libraryData: ILibraryData[]) {
    logger.info(`Games to add to library: ${JSON.stringify(libraryData)}`);
    await this.insertMany(libraryData);
  }

  async addGameToLibrary(libraryData: ILibraryData) {
    logger.info(`Game to add to library: ${JSON.stringify(libraryData)}`);

    await this.insert(libraryData);
  }
}

export default LibraryModelDTO;
