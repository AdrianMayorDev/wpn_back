import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import { IGameStatusDataWithID } from '@/interfaces/gameStatusModel.interface';
import { CustomError } from '@/utils/CustomError';

const updateGameStatusService = async (gameStatusModel: GameStatusModelDTO, gameStatusData: IGameStatusDataWithID) => {
  const { gameStatusId, userId, name } = gameStatusData;

  const gameStatus = await gameStatusModel.getGameStatusById(gameStatusId);
  if (!gameStatus) throw new CustomError('Game status not found', 404);

  if (gameStatus.userId !== userId) throw new CustomError('Unauthorized', 401);

  const data = { name, userId };

  await gameStatusModel.updateGameStatus(gameStatusId, data);
};

export default updateGameStatusService;
