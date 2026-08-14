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
      const { name, photoUrl, position } = req.body;
      const player = await this.playerService.createPlayer({
        name,
        photoUrl,
        position,
      });

      res.status(201).json({ success: true, data: player, message: 'Jogador cadastrado com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, photoUrl, position } = req.body;

      const player = await this.playerService.updatePlayer(id, { name, photoUrl, position });
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
        message: `Sua avaliação (${Number(value).toFixed(1)}) foi registrada com sucesso de forma sigilosa!`,
      });
    } catch (error) {
      next(error);
    }
  };
}
