import {
  ILibraryData,
  ILibraryDataDB,
  LibraryFields,
  mapLibraryToDbFields,
  mapLibraryToModel,
} from '@/interfaces/libraryModel.interface';
import { logger } from '@/utils/logger';
import BaseQuery from '../base/baseQuery';

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

  async updateGameInLibrary(userId: string, gameId: string, data: Partial<ILibraryData>) {
    logger.info(`Updating game in library: ${gameId} for user: ${userId}`);
    await this.update({
      keyField: this.fields.GAME_ID,
      data: { ...data, userId, gameId },
      value: gameId,
    });
  }

  async deleteGameFromLibrary(userId: string, gameId: string) {
    logger.info(`Deleting game from library: ${gameId} for user: ${userId}`);
    await this.delete({
      keyField: this.fields.GAME_ID,
      value: gameId,
    });
  }

  async getUserLibrary(userId: string) {
    const fieldsToSelect = [
      this.fields.USER_ID,
      this.fields.GAME_ID,
      this.fields.STATUS_ID,
      this.fields.ADDED_AT,
      this.fields.UPDATED_AT,
      this.fields.MANUAL_INDEX,
    ];
    const keyField = this.fields.USER_ID;
    const userLibrary = await this.getByField({ fieldsToSelect, keyField, value: userId });
    return userLibrary;
  }

  async getGameStatus({ gameId }: { gameId: string }) {
    const fieldsToSelect = [this.fields.STATUS_ID];
    const keyFields = [this.fields.USER_ID, this.fields.GAME_ID];
    const values = [gameId];
    const gameStatus = await this.getByManyFields({ fieldsToSelect, keyFields, values });

    if (!gameStatus) return null;

    logger.info(`Game status found in library: `, gameStatus);
    console.info(gameStatus);

    return gameStatus;
  }
}

export default LibraryModelDTO;
