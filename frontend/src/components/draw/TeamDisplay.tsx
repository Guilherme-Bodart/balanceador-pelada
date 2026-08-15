import React from 'react';
import { DrawResponse } from '../../types';
import { Badge } from '../common/Badge';
import { PlayerShield } from '../players/PlayerShield';
import { ShieldAlert, Share2, CheckCircle2, AlertTriangle, RefreshCw, Scale } from 'lucide-react';
import { Button } from '../common/Button';

interface TeamDisplayProps {
  result: DrawResponse;
  onOpenShare: () => void;
  onRedraw: () => void;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  result,
  onOpenShare,
  onRedraw,
}) => {
  const { teamA, teamB, differenceScore, advantageTeam, isEquilibrado } = result;

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Banner Superior de Equilíbrio e Diferença de Força */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between shadow-sm ${
          isEquilibrado
            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isEquilibrado ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-white truncate">
              {isEquilibrado ? 'Times Equilibrados' : 'Equilíbrio Ajustado'}
            </h4>
            <p className="text-[11px] text-slate-300 truncate">
              {advantageTeam || `Diferença estimada: ${differenceScore.toFixed(1)} pts`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={isEquilibrado ? 'emerald' : 'amber'} size="sm">
            <Scale className="w-3 h-3 mr-1 inline" />
            Δ {differenceScore.toFixed(1)} pts
          </Badge>
        </div>
      </div>

      {/* Duelo de Times com Escudos Gamificados */}
      <div className="relative glass-panel rounded-3xl p-3 sm:p-4 border border-slate-800 shadow-card-elevated">
        {/* Emblema "X" Centralizado no topo dos times */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950 border-2 border-emerald-500/80 shadow-glow-emerald flex items-center justify-center">
          <span className="font-black text-xs sm:text-sm text-emerald-400 font-display">
            X
          </span>
        </div>

        {/* Grid Lado a Lado (2 Colunas com Escudos) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* ================= TIME 1 (ESQUERDA) ================= */}
          <div className="space-y-3">
            {/* Header Time 1 */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-slate-900 border border-emerald-500/40 text-left min-h-[58px] flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🟢</span>
                <h3 className="font-black text-white text-xs sm:text-sm tracking-tight truncate">
                  Time 1
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {teamA.totalPlayers} atletas escalados
              </span>
            </div>

            {/* Goleiro Time 1 em Destaque */}
            {teamA.goalkeeper && (
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 px-1">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  Goleiro
                </span>
                <PlayerShield player={teamA.goalkeeper} isGoalkeeper={true} />
              </div>
            )}

            {/* Jogadores de Linha Time 1 em Escudos */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Linha ({teamA.fieldPlayers.length})
              </span>
              <div className="grid grid-cols-1 gap-2">
                {teamA.fieldPlayers.map((player, idx) => (
                  <PlayerShield
                    key={player.id}
                    player={player}
                    numberLabel={idx + 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ================= TIME 2 (DIREITA) ================= */}
          <div className="space-y-3">
            {/* Header Time 2 */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-sky-950/90 to-slate-900 border border-sky-500/40 text-left min-h-[58px] flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🔵</span>
                <h3 className="font-black text-white text-xs sm:text-sm tracking-tight truncate">
                  Time 2
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {teamB.totalPlayers} atletas escalados
              </span>
            </div>

            {/* Goleiro Time 2 em Destaque */}
            {teamB.goalkeeper && (
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 px-1">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  Goleiro
                </span>
                <PlayerShield player={teamB.goalkeeper} isGoalkeeper={true} />
              </div>
            )}

            {/* Jogadores de Linha Time 2 em Escudos */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Linha ({teamB.fieldPlayers.length})
              </span>
              <div className="grid grid-cols-1 gap-2">
                {teamB.fieldPlayers.map((player, idx) => (
                  <PlayerShield
                    key={player.id}
                    player={player}
                    numberLabel={idx + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação do Sorteio */}
      <div className="flex gap-2.5 pt-1">
        <Button
          type="button"
          variant="secondary"
          className="flex-1 text-xs sm:text-sm"
          onClick={onRedraw}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Sortear Novamente
        </Button>
        <Button
          type="button"
          variant="glow"
          className="flex-1 text-xs sm:text-sm"
          onClick={onOpenShare}
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
};
