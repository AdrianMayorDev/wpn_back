import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import { CustomError } from '@/utils/CustomError';

const getGameStatusService = async (libraryModel: GameStatusModelDTO, userId: string, gameId: string) => {
  const gameStatus = await libraryModel.getGameStatusById(gameId);
  if (!gameStatus) {
    throw new Error('Game status not found');
  }

  if (gameStatus.userId !== userId) {
    throw new CustomError('Unauthorized', 401);
  }

  return gameStatus;
};

export default getGameStatusService;
