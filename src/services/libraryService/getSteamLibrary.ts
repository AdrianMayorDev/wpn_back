import { IGetSteamOwnedGames } from '@/interfaces/response.interface';
import { IUserData } from '@/interfaces/userModel.interface';
import { CustomError } from '@/utils/CustomError';
import { logger } from '@/utils/logger';
import { config } from '@/config';
import { ISteamGameData } from '@/interfaces/gameModel.interface';

const STEAM_API_KEY = config.STEAM_API_KEY;

const getSteamLibrary = async ({
  steamNick,
  steamId,
}: {
  userId: string;
  steamNick: IUserData['steamNick'];
  steamId: IUserData['steamUserId'];
}): Promise<ISteamGameData[]> => {
  try {
    await validateSteamUser(steamNick, steamId);
    const libraryJson = await fetchLibraryData(steamId);
    const totalGames = libraryJson.response.games;
    return totalGames;
  } catch (error) {
    const err = error as Error;
    throw new CustomError(`Error in syncLibraryService: ${err.message}`, 500, err);
  }

  async function validateSteamUser(steamNick: string, steamId: string) {
    try {
      const steamNickData = await fetch(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${steamNick}`
      );
      const steamNickJson = await steamNickData.json();
      logger.info(`SteamNick data fetched: ${JSON.stringify(steamNickJson)}`);

      const steamIdData = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
      );
      console.log(`SteamId data fetched: ${JSON.stringify(steamIdData)}`);
      const steamIdJson = await steamIdData.json();
      logger.info(`SteamId data fetched: ${JSON.stringify(steamIdJson)}`);

      if (
        steamNickJson.response.steamid.toLowerCase() !== steamId.toLowerCase() ||
        !steamIdJson.response.players[0].profileurl.includes(steamNick)
      ) {
        logger.error(`Invalid steamNick or steamId: ${steamNick}, ${steamId}`);
        throw new CustomError('Invalid steamNick or steamId', 400);
      }
    } catch (error) {
      const err = error as Error;
      throw new CustomError(`Error validating Steam user: ${err.message}`, 500, err);
    }
  }

  async function fetchLibraryData(steamId: string): Promise<IGetSteamOwnedGames> {
    try {
      logger.info(`Fetching library data for steamId: ${steamId}`);
      const libraryData = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`
      );
      const libraryJson: IGetSteamOwnedGames = await libraryData.json();
      logger.info(`Library data fetched: ${JSON.stringify(libraryJson)}`);
      return libraryJson;
    } catch (error) {
      const err = error as Error;
      throw new CustomError(`Error fetching library data: ${err.message}`, 500, err);
    }
  }
};

export default getSteamLibrary;
