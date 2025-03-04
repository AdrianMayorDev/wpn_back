import dotenv from 'dotenv';
import type { Express } from 'express';
import express from 'express';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT ?? 3005;

app.use(express.json());
app.use('/user', userRoutes);
// test
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
