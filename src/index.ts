import dotenv from "dotenv";
import express, { Express } from "express";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 3005;

app.use(express.json());
app.use("/user", userRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
