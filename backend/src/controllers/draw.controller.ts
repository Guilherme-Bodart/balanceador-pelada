import { Request, Response, NextFunction } from 'express';
import { DrawService } from '../services/draw.service';

export class DrawController {
  private drawService: DrawService;

  constructor(drawService: DrawService = new DrawService()) {
    this.drawService = drawService;
  }

  public draw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerIds, playersPerTeam, goalkeeperIds } = req.body;

      const result = await this.drawService.drawTeams({
        playerIds,
        playersPerTeam: Number(playersPerTeam),
        goalkeeperIds: Array.isArray(goalkeeperIds) ? goalkeeperIds : undefined,
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Times sorteados e perfeitamente equilibrados!',
      });
    } catch (error) {
      next(error);
    }
  };
}
