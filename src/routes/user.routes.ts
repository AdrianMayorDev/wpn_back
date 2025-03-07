import { authMiddleware } from '@/middlewares/authMiddleware';
import {
  createUserController,
  updateUserController,
  getUserController,
  loginUserController,
  deleteUserController,
} from '../controllers/userController';
import express from 'express';

const router = express.Router();

router.get('/:userId', getUserController);

router.post('/', createUserController);
router.post('/login', loginUserController);

router.put('/', authMiddleware, updateUserController);

router.delete('/', authMiddleware, deleteUserController);

export default router;
