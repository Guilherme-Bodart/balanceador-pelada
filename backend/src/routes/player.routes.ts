import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';

const router = Router();
const controller = new PlayerController();

// GET /api/players - Lista todos os jogadores com médias
router.get('/', controller.getAll);

// GET /api/players/:id - Detalhes de um jogador
router.get('/:id', controller.getById);

// POST /api/players - Cadastra novo jogador
router.post('/', controller.create);

// PUT /api/players/:id - Atualiza dados do jogador
router.put('/:id', controller.update);

// DELETE /api/players/:id - Remove jogador
router.delete('/:id', controller.delete);

// POST /api/players/monthly-reset - Executa virada de mês / reset de notas com consolidação de base
router.post('/monthly-reset', controller.monthlyReset);

// GET /api/players/ratings/all - Consulta todos os votos de todos os atletas (Auditoria)
router.get('/ratings/all', controller.getAllRatings);

// GET /api/players/:id/ratings - Consulta todas as notas individuais de um atleta
router.get('/:id/ratings', controller.getRatings);

// POST /api/players/:id/ratings - Atribui uma nota de Skill (1.0 - 10.0)
router.post('/:id/ratings', controller.addRating);

export const playerRoutes = router;
