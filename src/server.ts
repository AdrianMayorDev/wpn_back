import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { app } from '@/app';
import { logger } from './utils/logger';
import libraryRoutes from './routes/library.routes';
import { userServiceMiddleware } from './middlewares/userServiceMiddleware';
import cors from 'cors';
import externalApiRoutes from './routes/externalApi.routes';

// Enable CORS
app.use(cors());

// Debug Middleware
app.use((req, _res, next) => {
  logger.info(`[${req.method}]: ${req.url}`);
  next();
});

// Initialize services
app.use(userServiceMiddleware);

// Routes
app.use('/user', userRoutes);
app.use('/library', libraryRoutes);
app.use('/externalApi', externalApiRoutes);

// Test Middleware
app.get('/test', (_req, res) => {
  res.status(200).send('Server is running');
});

// Error Middleware
app.use(errorMiddleware);

// 404 Middleware
app.use((req, res, _next) => {
  res.status(404).json({ message: 'Not Found' });
});

export { app };
