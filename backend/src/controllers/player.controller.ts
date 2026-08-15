import { Request, Response, NextFunction } from 'express';
import { PlayerService } from '../services/player.service';

export class PlayerController {
  private playerService: PlayerService;

  constructor(playerService: PlayerService = new PlayerService()) {
    this.playerService = playerService;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const players = await this.playerService.getAllPlayers();
      res.status(200).json({ success: true, data: players });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const player = await this.playerService.getPlayerById(id);

      if (!player) {
        res.status(404).json({ success: false, message: 'Jogador não encontrado.' });
        return;
      }

      res.status(200).json({ success: true, data: player });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, photoUrl, position, physicalRating } = req.body;
      const player = await this.playerService.createPlayer({
        name,
        photoUrl,
        position,
        physicalRating: physicalRating !== undefined ? Number(physicalRating) : undefined,
      });

      res.status(201).json({ success: true, data: player, message: 'Jogador cadastrado com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, photoUrl, position, physicalRating } = req.body;

      const player = await this.playerService.updatePlayer(id, {
        name,
        photoUrl,
        position,
        physicalRating: physicalRating !== undefined ? Number(physicalRating) : undefined,
      });
      res.status(200).json({ success: true, data: player, message: 'Jogador atualizado com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.playerService.deletePlayer(id);
      res.status(200).json({ success: true, message: 'Jogador excluído com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  public addRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { value } = req.body;

      const result = await this.playerService.addRating(id, { value: Number(value) });
      res.status(200).json({
        success: true,
        data: null,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public monthlyReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.playerService.performMonthlyReset();
      res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public getRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.playerService.getPlayerRatings(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  public getAllRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.playerService.getAllRatingsAudit();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
