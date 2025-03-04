import { getUserController } from "@/controllers/userController";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/:userID", getUserController);

export default userRoutes;
