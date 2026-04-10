import { ISteamGameData } from './gameModel.interface';

interface IApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
}

interface IGetSteamOwnedGames {
  game_count: number;
  response: {
    games: ISteamGameData[];
  };
}

export { IApiResponse, IGetSteamOwnedGames };
