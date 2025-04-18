import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';

const getGameStatusService = async (libraryModel: GameStatusModelDTO, userId: string, gameId: string) => {
  logger.debug(`Fetching game status for user: ${userId}, gameId: ${gameId}`);
  const gameStatus = await libraryModel.getGameStatusById(gameId);
  if (!gameStatus) {
    throw new Error('Game status not found');
  }

  if (gameId !== '1' && gameStatus.userId !== userId) {
    throw new CustomError('Unauthorized', 401);
  }

  return gameStatus;
};

export default getGameStatusService;
