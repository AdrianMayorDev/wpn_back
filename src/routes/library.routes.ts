import express from 'express';
import { authMiddleware } from '@/middlewares/authMiddleware';
import syncLibraryController from '@/controllers/libraryController/syncLibraryController';
import createGameStatusController from '@/controllers/libraryController/createGameStatusController';
import updateGameStatusController from '@/controllers/libraryController/updateGameStatusController';
import deleteGameStatusController from '@/controllers/libraryController/deleteGameStatusController';
import assignGameStatusController from '@/controllers/libraryController/assignGameStatusController';
import removeGameFromLibraryController from '@/controllers/libraryController/removeGameFromLibraryController';
import getUserLibraryController from '@/controllers/libraryController/getUserLibraryController';
import getGameController from '@/controllers/libraryController/getGameController';
import getGameStatusController from '@/controllers/libraryController/getGamesStatusController';
import getAllStatusController from '@/controllers/libraryController/getAllStatusController';

const router = express.Router();

// GET
router.get('/', authMiddleware, getUserLibraryController);
router.get('/game/:gameId', getGameController);
router.get('/status/:gameId', authMiddleware, getGameStatusController);
router.get('/allStatus', authMiddleware, getAllStatusController);

// POST
router.post('/sync', authMiddleware, syncLibraryController);
router.post('/status', authMiddleware, createGameStatusController);
router.post('/assign-status', authMiddleware, assignGameStatusController);

// PUT
router.put('/status', authMiddleware, updateGameStatusController);
router.put('/status/:statusId', authMiddleware, updateGameStatusController);

// DELETE
router.delete('/status', authMiddleware, deleteGameStatusController);
router.delete('/game', authMiddleware, removeGameFromLibraryController);

export default router;
