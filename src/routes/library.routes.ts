import express from 'express';
import { authMiddleware } from '@/middlewares/authMiddleware';
import syncLibraryController from '@/controllers/libraryController/syncLibraryController';

const router = express.Router();

// GET

// POST
router.post('/', authMiddleware, syncLibraryController);

// PUT

// DELETE

export default router;
