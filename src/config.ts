import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_SECRET: requireEnv('JWT_SECRET'),
  STEAM_API_KEY: requireEnv('STEAM_API_KEY'),
  SERVER_PORT: process.env.SERVER_PORT ?? '3005',
  DB_HOST: requireEnv('DB_HOST'),
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),
  DB_NAME: requireEnv('DB_NAME'),
};
