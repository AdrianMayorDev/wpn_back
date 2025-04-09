import { config } from '@/config';
import mysql, { Pool, PoolConnection } from 'mysql2/promise';

// import dotenv from 'dotenv';

// dotenv.config();

let pool: Pool;

const getConnection = async (): Promise<PoolConnection> => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        connectionLimit: 10,
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        timezone: 'Z',
      });
    }

    return await pool.getConnection();
  } catch (err) {
    console.error(err);
    throw new Error('Error connecting to the database');
  }
};

export default getConnection;
