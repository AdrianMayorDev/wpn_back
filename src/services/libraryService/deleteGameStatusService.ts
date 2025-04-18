import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import { IGameStatusDataWithID } from '@/interfaces/gameStatusModel.interface';
import { CustomError } from '@/utils/CustomError';

const deleteGameStatusService = async (gameStatusModel: GameStatusModelDTO, gameStatusData: IGameStatusDataWithID) => {
  const { gameStatusId, userId } = gameStatusData;

  const gameStatus = await gameStatusModel.getGameStatusById(gameStatusId);
  if (!gameStatus) throw new Error('Game status not found');

  if (gameStatus.userId !== userId) throw new CustomError('Unauthorized', 401);

  if (gameStatusId === '1') throw new CustomError('Cannot delete default game status', 400);

  await gameStatusModel.deleteGameStatus(gameStatusId);
};

export default deleteGameStatusService;
