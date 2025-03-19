import { IGameData } from '@/interfaces/gameModel.interface';
import { IUserData } from '@/interfaces/userModel.interface';
import ScrapingService from './scrapping/ScrapingService';
import GamesModel from '@/DTO/gamesModel/GamesModelDTO';
import { IGetSteamOwnedGames } from '@/interfaces/response.interface';
import LibraryModel from '@/DTO/libraryModel/LibraryModelDTO';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/config';

const STEAM_API_KEY = config.STEAM_API_KEY;

class LibraryService {
  async syncLibrary({
    userId,
    steamNick,
    steamId,
  }: {
    userId: string;
    steamNick: IUserData['steamNick'];
    steamId: IUserData['steamUserId'];
  }) {
    logger.info(`Access to sync library service. userId: ${userId}, steamNick: ${steamNick}, steamId: ${steamId}`);
    // check if steamNick and steamId are valid
    const steamNickData = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${steamNick}`
    );
    const steamNickJson = await steamNickData.json();
    logger.info(`SteamNick data fetched: ${JSON.stringify(steamNickJson)}`);

    const steamIdData = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
    );
    const steamIdJson = await steamIdData.json();
    logger.info(`SteamId data fetched: ${JSON.stringify(steamIdJson)}`);

    if (steamNickJson.response.steamid !== steamId || !steamIdJson.response.players[0].profileurl.includes(steamNick)) {
      throw new Error('Invalid steamNick or steamId');
    }
    // fetch library from steam
    logger.info(`Fetching library data for steamId: ${steamId}`);
    const libraryData = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`
    );
    const libraryJson: IGetSteamOwnedGames = await libraryData.json();
    logger.info(`Library data fetched: ${JSON.stringify(libraryJson)}`);

    const gameModel = new GamesModel();
    const libraryModel = new LibraryModel();

    for (const game of libraryJson.response.games) {
      logger.info(`Processing game: ${game.name} (appid: ${game.appid})`);
      const checkGameExist = await gameModel.getGameBySteamId({ steamAppId: game.appid });

      if (!checkGameExist) {
        const gameHeaderUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;

        try {
          const scrapingService = new ScrapingService(game.name);
          const metacriticData = await scrapingService.scrapMetacritc();
          const HLTBData = await scrapingService.scrapHowLongToBeat();

          const gameData: IGameData = {
            gameId: uuidv4(),
            gameTitle: game.name,
            steamGameId: game.appid,
            headerUrl: gameHeaderUrl,
            gameReleaseDate: metacriticData.releasedDate,
            gameGenres: metacriticData.genres,
            gamePlatforms: metacriticData.platforms,
            metacriticGameId: metacriticData.metacriticId,
            howLongToBeatGameId: HLTBData.howLongToBeatId,
            mainStoryTime: HLTBData.mainStory,
            mainPlusExtrasTime: HLTBData.mainExtra,
            completionistTime: HLTBData.completionist,
            combinedTime: HLTBData.combined,
            metacriticScore: metacriticData.pressScore,
            usersScore: metacriticData.userScore,
            howLongToBeatReviewScore: HLTBData.howLongToBeatReview,
            ratioUsersMainStory: HLTBData.mainStory ? metacriticData.userScore / HLTBData.mainStory : 0,
            ratioUsersMainExtra: HLTBData.mainExtra ? metacriticData.userScore / HLTBData.mainExtra : 0,
            ratioUsersCompletionist: HLTBData.completionist ? metacriticData.userScore / HLTBData.completionist : 0,
            ratioUsersCombined: HLTBData.combined ? metacriticData.userScore / HLTBData.combined : 0,
            ratioMetacriticMainStory: HLTBData.mainStory ? metacriticData.pressScore / HLTBData.mainStory : 0,
            ratioMetacriticMainExtra: HLTBData.mainExtra ? metacriticData.pressScore / HLTBData.mainExtra : 0,
            ratioMetacriticCompletionist: HLTBData.completionist
              ? metacriticData.pressScore / HLTBData.completionist
              : 0,
            ratioMetacriticCombined: HLTBData.combined ? metacriticData.pressScore / HLTBData.combined : 0,
            gameIsMulti: HLTBData.isMulti,
            gameIsCoop: HLTBData.isCoop,
            gameIsSinglePlayer: HLTBData.isSinglePlayer,
          };

          // gamesToCreate.push(gameData);
          // logger.info(`Game data prepared for creation: ${JSON.stringify(gameData)}`);

          await gameModel.createNewGame({ game: gameData });
          logger.info(`Game created: ${gameData.gameTitle}`);

          const gameToAdd = {
            userId,
            gameId: gameData.gameId,
            gameStatusId: 1,
          };

          // gamesToAddToLibrary.push(gameToAdd);
          // logger.info(`Game prepared to be added to library: ${JSON.stringify(gameToAdd)}`);

          await libraryModel.addGameToLibrary(gameToAdd);
          logger.info(`Game added to library: ${gameData.gameTitle}`);
        } catch (error) {
          console.error(`Error scraping data for game ${game.name}:`, error);
        }
      } else {
        const checkGameExistInLibrary = await libraryModel.getGameInUserLibrary({
          userId,
          gameId: checkGameExist.gameId,
        });

        if (!checkGameExistInLibrary) {
          const gameToAdd = {
            userId,
            gameId: checkGameExist.gameId,
            gameStatusId: 1,
          };
          // gamesToAddToLibrary.push(gameToAdd);
          // logger.info(`Game prepared to be added to library: ${JSON.stringify(gameToAdd)}`);
          await libraryModel.addGameToLibrary(gameToAdd);
          logger.info(`Game added to library: ${checkGameExist.gameTitle}`);
        }
      }
    }
    // save library to database
    // logger.info('Saving new games to database');
    // await gameModel.createManyGames(gamesToCreate);
    // logger.info('New games saved to database');

    // logger.info('Adding games to user library');
    // await libraryModel.addManyGamesToLibrary(gamesToAddToLibrary);
    // logger.info('Games added to user library');
  }
}

export default LibraryService;
