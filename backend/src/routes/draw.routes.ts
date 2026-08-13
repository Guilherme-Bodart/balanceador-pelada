import { Router } from 'express';
import { DrawController } from '../controllers/draw.controller';

const router = Router();
const controller = new DrawController();

// POST /api/draw - Executa o sorteio com o algoritmo de equilíbrio e Snake Draft
router.post('/', controller.draw);

export const drawRoutes = router;
