import dotenv from 'dotenv';
import express, { Express } from 'express';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT ?? 3005;

app.use(express.json());

// Routes
app.use('/user', userRoutes);

// Error Middleware
app.use(errorHandler);

// Listen Middleware
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
