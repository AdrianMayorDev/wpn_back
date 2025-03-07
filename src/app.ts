import dotenv from 'dotenv';

import express, { Express } from 'express';
import { logger } from './utils/logger';

dotenv.config();

const port = process.env.SERVER_PORT ?? 3005;

export const app: Express = express();
app.use(express.json());

// Listen Middleware
if (process.env.NODE_ENV !== 'test')
  app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
  });
