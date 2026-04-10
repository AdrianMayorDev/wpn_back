import {
  GameStatusFields,
  IGameStatusDataDB,
  mapGameStatusToDbFields,
  mapGameStatusToModel,
} from '@/interfaces/gameStatusModel.interface';
import BaseQuery from '../base/baseQuery';
import { logger } from '@/utils/logger';

interface IGameStatusData {
  gameStatusId?: string;
  name: string;
  userId: string;
}

class GameStatusModelDTO extends BaseQuery<IGameStatusData, IGameStatusDataDB> {
  protected table = 'game_status';
  protected fields = GameStatusFields;

  protected mapToDbFields(data: IGameStatusData): IGameStatusDataDB {
    return mapGameStatusToDbFields(data);
  }

  protected mapToModel(data: IGameStatusDataDB): IGameStatusData {
    return mapGameStatusToModel(data);
  }

  async createGameStatus(data: IGameStatusData) {
    logger.debug(`gameStatusData: `, data);
    logger.info(`Creating game status: ${data.name}`);
    const response = await this.insert(data);
    return response;
  }

  async updateGameStatus(gameStatusId: string, data: Partial<IGameStatusData>): Promise<void> {
    logger.info(`Updating game status: ${gameStatusId}`);
    await this.update({ keyField: this.fields.GAME_STATUS_ID, data: { ...data, gameStatusId }, value: gameStatusId });
  }

  async deleteGameStatus(gameStatusId: string): Promise<void> {
    logger.info(`Deleting game status: ${gameStatusId}`);
    await this.delete({ keyField: this.fields.GAME_STATUS_ID, value: gameStatusId.toString() });
  }

  async getGameStatusById(gameStatusId: string): Promise<IGameStatusData | null> {
    const gameStatus = await this.getByField({
      fieldsToSelect: [this.fields.GAME_STATUS_ID, this.fields.NAME, this.fields.USER_ID],
      keyField: this.fields.GAME_STATUS_ID,
      value: gameStatusId,
    });

    return gameStatus?.[0] ?? null;
  }
}

export default GameStatusModelDTO;
