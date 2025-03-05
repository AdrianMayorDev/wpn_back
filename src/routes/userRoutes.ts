import { createUserController, updateUserController } from '../controllers/userController';
import express from 'express';

const router = express.Router();

router.post('/', createUserController);
router.put('/:userId', updateUserController);
// router.get('/:userID', getUserController);

export default router;
