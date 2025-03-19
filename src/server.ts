import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { app } from '@/app';
import { logger } from './utils/logger';
import libraryRoutes from './routes/library.routes';
import { userServiceMiddleware } from './middlewares/userServiceMiddleware';

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

// Test Middleware
app.get('/test', (_req, res) => {
  res.status(200).send('Server is running');
});

// Error Middleware
app.use(errorMiddleware);

export { app };
