import LibraryModelDTO from '@/DTO/libraryModel/LibraryModelDTO';
import { CustomError } from '@/utils/CustomError';

const assignGameStatusService = async (
  libraryModel: LibraryModelDTO,
  userId: string,
  gameId: string,
  gameStatusId: string
) => {
  const isGameInLibrary = await libraryModel.getGameInUserLibrary({ userId, gameId });
  if (!isGameInLibrary) throw new CustomError('Game not found in library', 404);

  await libraryModel.updateGameInLibrary(userId, gameId, { gameStatusId });
};

export default assignGameStatusService;
