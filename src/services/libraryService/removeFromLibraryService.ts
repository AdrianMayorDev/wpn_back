import LibraryModelDTO from '@/DTO/libraryModel/LibraryModelDTO';
import { CustomError } from '@/utils/CustomError';

const removeGameFromLibraryService = async (libraryModel: LibraryModelDTO, userId: string, gameId: string) => {
  const isGameInLibrary = await libraryModel.getGameInUserLibrary({ userId, gameId });
  if (!isGameInLibrary) throw new CustomError('Game not found in library', 404);

  await libraryModel.deleteGameFromLibrary(userId, gameId);
};

export default removeGameFromLibraryService;
