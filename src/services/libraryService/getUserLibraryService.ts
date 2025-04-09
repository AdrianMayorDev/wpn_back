import LibraryModelDTO from '@/DTO/libraryModel/LibraryModelDTO';
import { logger } from '@/utils/logger';

const getUserLibraryService = async (libraryModel: LibraryModelDTO, userId: string) => {
  const userLibrary = await libraryModel.getUserLibrary(userId);
  if (userLibrary && userLibrary.length === 0) logger.warn(`No games found in library for user: ${userId}`);

  return userLibrary;
};

export default getUserLibraryService;
