import { Router } from 'express';
import { playerRoutes } from './player.routes';
import { drawRoutes } from './draw.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Sorteador de Times Pro API', timestamp: new Date() });
});

// Agrupamento dos módulos
router.use('/players', playerRoutes);
router.use('/draw', drawRoutes);

export const appRouter = router;
