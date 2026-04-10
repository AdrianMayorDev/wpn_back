import GamesModelDTO from '@/DTO/gamesModel/GamesModelDTO';
import { CustomError } from '@/utils/CustomError';

const getGameService = async (gameModel: GamesModelDTO, gameId: string) => {
  const game = await gameModel.getGame({ gameId });
  if (!game) {
    throw new CustomError('Game not found', 404);
  }
  return game;
};

export default getGameService;
