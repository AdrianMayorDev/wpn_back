import GamesModel from '@/DTO/gamesModel/GamesModelDTO';
import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';
import LibraryModelDTO from '@/DTO/libraryModel/LibraryModelDTO';
import { ISteamGameData } from '@/interfaces/gameModel.interface';
import { IUserData } from '@/interfaces/userModel.interface';
import assignGameStatusService from './libraryService/assignGamesService';
import createGameStatusService from './libraryService/createGameStatusService';
import deleteGameStatusService from './libraryService/deleteGameStatusService';
import getAllStatusService from './libraryService/getAllStatusService';
import getGameService from './libraryService/getGameService';
import getGameStatusService from './libraryService/getGameStatusService';
import getSteamLibrary from './libraryService/getSteamLibrary';
import getUserLibraryService from './libraryService/getUserLibraryService';
import removeGameFromLibraryService from './libraryService/removeFromLibraryService';
import syncLibraryService from './libraryService/syncLibraryService';
import updateGameStatusService from './libraryService/updateGameStatusService';
import ScrapingService from './scrappingService/ScrapingService';
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
  private readonly getAllStatusService = getAllStatusService;
  private readonly getSteamLibrary = getSteamLibrary;

  async getLibrarySteam({
    userId,
    steamNick,
    steamId,
  }: {
    userId: string;
    steamNick: IUserData['steamNick'];
    steamId: IUserData['steamUserId'];
  }) {
    const response = await this.getSteamLibrary({
      userId,
      steamNick,
      steamId,
    });
    return response;
  }

  async syncLibrary({
    userId,
    steamNick,
    steamId,
    libraryData,
  }: {
    userId: string;
    steamNick: IUserData['steamNick'];
    steamId: IUserData['steamUserId'];
    libraryData: ISteamGameData[];
  }) {
    await this.syncLibraryService({
      userId,
      steamNick,
      steamId,
      scrapingService: this.scrapingService,
      gamesModel: this.gamesModel,
      libraryModel: this.libraryModel,
      gameStatusModel: this.gameStatusModel,
      libraryJson: libraryData,
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

  async assignGameStatusToGame(userId: string, gameId: string, gameStatusId: string) {
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

  async getAllStatus(userId: string) {
    const allStatus = await this.getAllStatusService(this.gameStatusModel, userId);
    return allStatus;
  }
}

export default LibraryService;
