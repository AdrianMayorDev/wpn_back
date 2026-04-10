import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import { IGameStatusDataWithID } from '@/interfaces/gameStatusModel.interface';
import { CustomError } from '@/utils/CustomError';

const deleteGameStatusService = async (gameStatusModel: GameStatusModelDTO, gameStatusData: IGameStatusDataWithID) => {
  const { gameStatusId, userId } = gameStatusData;

  const gameStatus = await gameStatusModel.getGameStatusById(gameStatusId);
  if (!gameStatus) throw new CustomError('Game status not found', 404);

  if (gameStatus.userId !== userId) throw new CustomError('Unauthorized', 401);

  await gameStatusModel.deleteGameStatus(gameStatusId);
};

export default deleteGameStatusService;
