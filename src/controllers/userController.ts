import { Request, Response } from "express";
import { getUserData, createUserData, updateUserData, deleteUserData } from "@/services/userService";

export const getUserController = (req: Request, res: Response) => {
	const { userID } = req.params;
	const userData = getUserData(userID);
	res.send(userData);
};

export const createUserController = (req: Request, res: Response) => {
	const result = createUserData();
	res.send(result);
};

export const updateUserController = (req: Request, res: Response) => {
	const result = updateUserData();
	res.send(result);
};

export const deleteUserController = (req: Request, res: Response) => {
	const result = deleteUserData();
	res.send(result);
};
