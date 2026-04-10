import { config } from '@/config';
import { logger } from '@/utils/logger';
import { CustomError } from '@/utils/CustomError';
import mysql, { Pool, PoolConnection } from 'mysql2/promise';

let pool: Pool;

const getConnection = async (): Promise<PoolConnection> => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        connectionLimit: 10,
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        timezone: 'Z',
      });
    }

    return await pool.getConnection();
  } catch (err) {
    logger.error('Database connection error', err);
    throw new CustomError('Error connecting to the database', 500, err as Error);
  }
};

export default getConnection;
