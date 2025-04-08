import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import { logger } from '@/utils/logger';
import { CustomError } from '@/utils/CustomError';

const createGameStatusService = async (gameStatusModel: GameStatusModelDTO, userId: string, name: string) => {
  try {
    const gameStatusData = { userId, name };
    logger.debug(`gameStatusData: `, gameStatusData);
    logger.info(`Creating game status for userId: ${userId}, name: ${name}`);

    const response = await gameStatusModel.createGameStatus(gameStatusData);
    logger.info(`Game status created successfully for userId: ${userId}, name: ${name}`);
    return response;
  } catch (error) {
    const err = error as Error;
    throw new CustomError(`Error creating game status: ${err.message}`, 500, err);
  }
};

export default createGameStatusService;
