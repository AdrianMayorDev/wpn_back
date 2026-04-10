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

// GET
router.get('/:userId', getUserController);

// POST
router.post('/', createUserController);
router.post('/login', loginUserController);

// PUT
router.put('/', authMiddleware, updateUserController);

// DELETE
router.delete('/', authMiddleware, deleteUserController);

export default router;
