import getSteamUser from '@/controllers/externalApiController/getSteamUser';
import express from 'express';

const router = express.Router();

// GET
router.get('/:username', getSteamUser);

export default router;
