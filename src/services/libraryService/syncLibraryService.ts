import { IUserData } from '@/interfaces/userModel.interface';
import ScrapingService from '../scrappingService/ScrapingService';
import GamesModel from '@/DTO/gamesModel/GamesModelDTO';
import LibraryModelDTO from '@/DTO/libraryModel/LibraryModelDTO';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { IGameData, ISteamGameData } from '@/interfaces/gameModel.interface';
import { CustomError } from '@/utils/CustomError';
import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';

const syncLibraryService = async ({
  userId,
  steamNick,
  steamId,
  scrapingService,
  gamesModel,
  libraryModel,
  libraryJson,
}: {
  userId: string;
  steamNick: IUserData['steamNick'];
  steamId: IUserData['steamUserId'];
  scrapingService: ScrapingService;
  gamesModel: GamesModel;
  libraryModel: LibraryModelDTO;
  gameStatusModel: GameStatusModelDTO;
  libraryJson: ISteamGameData[];
}) => {
  try {
    logger.info(`Access to sync library service. userId: ${userId}, steamNick: ${steamNick}, steamId: ${steamId}`);

    await scrapingService.captureApiUrlOnce();

    for (const game of libraryJson) {
      await processGame(userId, game);
    }
  } catch (error) {
    const err = error as Error;
    throw new CustomError(`Error in syncLibraryService: ${err.message}`, 500, err);
  }

  // async function validateSteamUser(steamNick: string, steamId: string) {
  //   try {
  //     const steamNickData = await fetch(
  //       `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${steamNick}`
  //     );
  //     const steamNickJson = await steamNickData.json();
  //     logger.info(`SteamNick data fetched: ${JSON.stringify(steamNickJson)}`);

  //     const steamIdData = await fetch(
  //       `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
  //     );
  //     console.log(`SteamId data fetched: ${JSON.stringify(steamIdData)}`);
  //     const steamIdJson = await steamIdData.json();
  //     logger.info(`SteamId data fetched: ${JSON.stringify(steamIdJson)}`);

  //     if (
  //       steamNickJson.response.steamid.toLowerCase() !== steamId.toLowerCase() ||
  //       !steamIdJson.response.players[0].profileurl.includes(steamNick)
  //     ) {
  //       logger.error(`Invalid steamNick or steamId: ${steamNick}, ${steamId}`);
  //       throw new CustomError('Invalid steamNick or steamId', 400);
  //     }
  //   } catch (error) {
  //     const err = error as Error;
  //     throw new CustomError(`Error validating Steam user: ${err.message}`, 500, err);
  //   }
  // }

  // async function fetchLibraryData(steamId: string): Promise<IGetSteamOwnedGames> {
  //   try {
  //     logger.info(`Fetching library data for steamId: ${steamId}`);
  //     const libraryData = await fetch(
  //       `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`
  //     );
  //     const libraryJson: IGetSteamOwnedGames = await libraryData.json();
  //     logger.info(`Library data fetched: ${JSON.stringify(libraryJson)}`);
  //     return libraryJson;
  //   } catch (error) {
  //     const err = error as Error;
  //     throw new CustomError(`Error fetching library data: ${err.message}`, 500, err);
  //   }
  // }

  async function processGame(userId: string, game: ISteamGameData) {
    try {
      logger.info(`Processing game: ${game.name} (appid: ${game.appid})`);
      const checkGameExist = await gamesModel.getGameBySteamId({ steamAppId: game.appid });

      if (!checkGameExist) {
        await createAndAddGame(userId, game);
      } else {
        await addGameToLibraryIfNotExists(userId, checkGameExist.gameId, checkGameExist.gameTitle);
      }
    } catch (error) {
      const err = error as Error;
      throw new CustomError(`Error processing game ${game.name}: ${err.message}`, 500, err);
    }
  }

  async function createAndAddGame(userId: string, game: ISteamGameData) {
    const gameHeaderUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;

    try {
      logger.info(`Creating game: ${game.name} (appid: ${game.appid})`);

      const metacriticData = await scrapingService.scrapMetacritic(game.name);
      const HLTBData = await scrapingService.scrapHowLongToBeat(game.name);

      logger.info(`Game data fetched`);

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
        ratioMetacriticCompletionist: HLTBData.completionist ? metacriticData.pressScore / HLTBData.completionist : 0,
        ratioMetacriticCombined: HLTBData.combined ? metacriticData.pressScore / HLTBData.combined : 0,
        gameIsMulti: HLTBData.isMulti,
        gameIsCoop: HLTBData.isCoop,
        gameIsSinglePlayer: HLTBData.isSinglePlayer,
      };
      logger.debug(`Game data howLongToBeatGameId: ${HLTBData.howLongToBeatId}`);
      await gamesModel.createNewGame({ game: gameData });
      logger.info(`Game created: ${gameData.gameTitle}`);

      const gameToAdd = {
        userId,
        gameId: gameData.gameId,
        gameStatusId: '1',
      };

      await libraryModel.addGameToLibrary(gameToAdd);
      logger.info(`Game added to library: ${gameData.gameTitle}`);
    } catch (error) {
      const err = error as Error;
      throw new CustomError(`Error creating and adding game ${game.name}: ${err.message}`, 500, err);
    }
  }

  async function addGameToLibraryIfNotExists(userId: string, gameId: string, gameTitle: string) {
    try {
      const checkGameExistInLibrary = await libraryModel.getGameInUserLibrary({
        userId,
        gameId,
      });

      if (!checkGameExistInLibrary) {
        const gameToAdd = {
          userId,
          gameId,
          gameStatusId: '1',
        };
        await libraryModel.addGameToLibrary(gameToAdd);
        logger.info(`Game added to library: ${gameTitle}`);
      }
    } catch (error) {
      const err = error as Error;
      throw new CustomError(`Error adding game ${gameTitle} to library: ${err.message}`, 500, err);
    }
  }
};

export default syncLibraryService;
