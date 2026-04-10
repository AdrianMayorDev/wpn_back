import express, { Express } from 'express';
import { logger } from './utils/logger';
import { config } from './config';

const port = config.SERVER_PORT;

export const app: Express = express();

// Middleware to parse incoming JSON requests
app.use(express.json({ limit: '10mb' }));

// Listen Middleware
if (config.NODE_ENV !== 'test')
  app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
  });
