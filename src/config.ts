import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === 'test' && fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_SECRET: requireEnv('JWT_SECRET', 'test_jwt_secret'),
  STEAM_API_KEY: requireEnv('STEAM_API_KEY', 'test_steam_key'),
  SERVER_PORT: process.env.SERVER_PORT ?? '3005',
  DB_HOST: requireEnv('DB_HOST', 'localhost'),
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  DB_USER: requireEnv('DB_USER', 'root'),
  DB_PASSWORD: requireEnv('DB_PASSWORD', ''),
  DB_NAME: requireEnv('DB_NAME', 'wpn_test'),
};
