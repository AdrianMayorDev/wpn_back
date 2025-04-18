import { CustomError } from '@/utils/CustomError';
import { Request, Response, NextFunction } from 'express';

const STEAM_API_KEY = process.env.STEAM_API_KEY;

const getSteamUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.params;

  console.log('getSteamUser called ', username);

  if (!username) {
    throw new CustomError('Invalid username', 400);
  }

  try {
    const responseSteamId = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${username}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const dataSteamId = await responseSteamId.json();

    if (!dataSteamId.response.success) {
      throw new CustomError('User not found', 404);
    }

    const responseUsername = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${dataSteamId.response.steamid}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const dataUsername = await responseUsername.json();

    if (!dataUsername.response.players.length) {
      throw new CustomError('User not found', 404);
    }

    res.json(dataUsername);
  } catch (error) {
    next(error);
  }
};

export default getSteamUser;
