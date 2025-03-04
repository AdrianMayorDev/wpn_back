import { createUserController, getUserController } from '../controllers/userController';
import express from 'express';

const router = express.Router();

router.post('/', createUserController);
router.get('/:userID', getUserController);

export default router;
