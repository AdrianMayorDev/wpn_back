import dotenv from 'dotenv';

import express, { Express } from 'express';
import { logger } from './utils/logger';
import { config } from './config';

dotenv.config();

const port = config.SERVER_PORT ?? 3005;

export const app: Express = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Listen Middleware
if (config.NODE_ENV !== 'test')
  app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
  });
