import { IUserData } from '@/interfaces/userModel.interface';
import ScrapingService from './scrappingService/ScrapingService';
import GamesModel from '@/DTO/gamesModel/GamesModelDTO';
import LibraryModelDTO from '@/DTO/libraryModel/LibraryModelDTO';
import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import syncLibraryService from './libraryService/syncLibraryService';
import createGameStatusService from './libraryService/createGameStatusService';
import updateGameStatusService from './libraryService/updateGameStatusService';
import deleteGameStatusService from './libraryService/deleteGameStatusService';
import getUserLibraryService from './libraryService/getUserLibraryService';
import assignGameStatusService from './libraryService/assignGamesService';
import removeGameFromLibraryService from './libraryService/removeFromLibraryService';
import getGameService from './libraryService/getGameService';
import getGameStatusService from './libraryService/getGameStatusService';
class LibraryService {
  private readonly scrapingService = new ScrapingService();
  private readonly gamesModel = new GamesModel();
  private readonly libraryModel = new LibraryModelDTO();
  private readonly gameStatusModel = new GameStatusModelDTO();

  private readonly syncLibraryService = syncLibraryService;
  private readonly createGameStatusService = createGameStatusService;
  private readonly updateGameStatusService = updateGameStatusService;
  private readonly deleteGameStatusService = deleteGameStatusService;
  private readonly getGameService = getGameService;
  private readonly getUserLibraryService = getUserLibraryService;
  private readonly assignGameStatusService = assignGameStatusService;
  private readonly removeGameFromLibraryService = removeGameFromLibraryService;
  private readonly getGameStatusService = getGameStatusService;

  async syncLibrary({
    userId,
    steamNick,
    steamId,
  }: {
    userId: string;
    steamNick: IUserData['steamNick'];
    steamId: IUserData['steamUserId'];
  }) {
    await this.syncLibraryService({
      userId,
      steamNick,
      steamId,
      scrapingService: this.scrapingService,
      gamesModel: this.gamesModel,
      libraryModel: this.libraryModel,
    });
  }

  async createGameStatus(userId: string, name: string) {
    return await this.createGameStatusService(this.gameStatusModel, userId, name);
  }

  async updateGameStatus(userId: string, gameStatusId: string, name: string) {
    const gameStatusData = { userId, gameStatusId, name };
    await this.updateGameStatusService(this.gameStatusModel, gameStatusData);
  }

  async deleteGameStatus(userId: string, gameStatusId: string) {
    const gameStatusData = { userId, gameStatusId };
    await this.deleteGameStatusService(this.gameStatusModel, gameStatusData);
  }

  async getGame(gameId: string) {
    const game = await this.getGameService(this.gamesModel, gameId);
    return game;
  }

  async assignGameStatusToGame(userId: string, gameId: string, gameStatusId: number) {
    await this.assignGameStatusService(this.libraryModel, userId, gameId, gameStatusId);
  }

  async removeGameFromLibrary(userId: string, gameId: string) {
    await this.removeGameFromLibraryService(this.libraryModel, userId, gameId);
  }

  async getUserLibrary(userId: string) {
    return await this.getUserLibraryService(this.libraryModel, userId);
  }

  async getGameStatus(userId: string, gameId: string) {
    const gameStatus = await this.getGameStatusService(this.gameStatusModel, userId, gameId);
    return gameStatus;
  }
}

export default LibraryService;
