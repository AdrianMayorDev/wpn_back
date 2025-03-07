import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { app } from '@/app';
import { logger } from './utils/logger';

// Debug Middleware
app.use((req, res, next) => {
  logger.info(`[${req.method}]: ${req.url}`);
  next();
});

// Routes
app.use('/user', userRoutes);

// Test Middleware
app.get('/test', (req, res) => {
  res.status(200).send('Server is running');
});

// Error Middleware
app.use(errorMiddleware);

export { app };
