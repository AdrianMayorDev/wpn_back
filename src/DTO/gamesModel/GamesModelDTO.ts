import {
  GameFields,
  IGameData,
  IGameDataDB,
  mapGamesToDbFields,
  mapGamesToModel,
} from '@/interfaces/gameModel.interface';
import BaseQuery from '../base/baseQuery';
import { logger } from '@/utils/logger';

class GamesModelDTO extends BaseQuery<IGameData, IGameDataDB> {
  protected table = 'games';
  protected fields = GameFields;

  protected mapToDbFields(data: IGameData): IGameDataDB {
    return mapGamesToDbFields(data);
  }

  protected mapToModel(data: IGameDataDB): IGameData {
    return mapGamesToModel(data);
  }

  async getGameBySteamId({
    steamAppId,
    fieldsToSelect = [this.fields.GAME_ID],
  }: {
    steamAppId: number;
    fieldsToSelect?: GameFields[];
  }): Promise<IGameData | null> {
    const keyField = this.fields.STEAM_GAME_ID;
    const values = [steamAppId];
    const game = await this.getByField({ fieldsToSelect, keyField, values });

    if (!game) {
      return null;
    }

    logger.info(`Game found in Steam: ${game[0].gameTitle}`);
    console.info(game);

    if (!game) return null;
    return game[0];
  }

  async createNewGame({ game }: { game: IGameData }): Promise<Partial<IGameData>> {
    const response = await this.insert(game);

    logger.info(`Game created: ${game.gameTitle}`);
    console.info(response);

    return response;
  }

  async createManyGames({ games }: { games: IGameData[] }) {
    const response = await this.insertMany(games);
    logger.info(`Games to create: ${JSON.stringify(games)}`);
    return response;
  }

  async getGame({
    gameId,
    fieldsToSelect = [this.fields.ALL],
  }: {
    gameId: string;
    fieldsToSelect?: GameFields[];
  }): Promise<IGameData | null> {
    const keyField = this.fields.GAME_ID;
    const values = [gameId];
    const game = await this.getByField({ fieldsToSelect, keyField, values });

    if (!game) {
      return null;
    }

    logger.info(`Game found in DB: ${game[0].gameTitle}`);
    console.info(game);

    if (!game) return null;
    return game[0];
  }
}

export default GamesModelDTO;
