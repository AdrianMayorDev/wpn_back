import GamesModelDTO from '@/DTO/gamesModel/GamesModelDTO';

const getGameService = async (gameModel: GamesModelDTO, gameId: string) => {
  const game = await gameModel.getGame({ gameId });
  if (!game) {
    throw new Error('Game not found');
  }
  return game;
};

export default getGameService;
