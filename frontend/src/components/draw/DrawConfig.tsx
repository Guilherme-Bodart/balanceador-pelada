import React from 'react';
import { Button } from '../common/Button';
import { Shuffle, Users, ShieldAlert, Sparkles, CheckSquare, Square } from 'lucide-react';

interface DrawConfigProps {
  playersPerTeam: number;
  onPlayersPerTeamChange: (count: number) => void;
  totalSelected: number;
  totalGoalkeepers: number;
  onDraw: () => void;
  isLoading: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isAllSelected: boolean;
}

export const DrawConfig: React.FC<DrawConfigProps> = ({
  totalSelected,
  totalGoalkeepers,
  onDraw,
  isLoading,
  onSelectAll,
  onDeselectAll,
  isAllSelected,
}) => {
  const hasEnoughPlayers = totalSelected >= 2;
  const teamASize = Math.ceil(totalSelected / 2);
  const teamBSize = Math.floor(totalSelected / 2);

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-800 space-y-4 mb-4 shadow-card-elevated">
      {/* Resumo da Partida e Distribuição */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">Total Marcados Hoje:</span>
            <span
              className={`font-black font-mono px-2.5 py-0.5 rounded-lg text-sm ${
                hasEnoughPlayers
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {totalSelected} atletas
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Distribuição: <strong className="text-white font-mono">{teamASize} vs {teamBSize}</strong> (com reservas)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Goleiros: <strong className="text-amber-400">{totalGoalkeepers}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Botão Selecionar Todos / Desmarcar */}
        <div className="shrink-0 pl-2">
          <button
            type="button"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors shadow-sm"
          >
            {isAllSelected ? (
              <>
                <Square className="w-3.5 h-3.5" />
                Desmarcar
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Marcar Todos
              </>
            )}
          </button>
        </div>
      </div>

      {/* Botão Principal de Disparo do Sorteio */}
      <Button
        type="button"
        variant="glow"
        size="lg"
        className="w-full text-base font-extrabold tracking-wide"
        disabled={!hasEnoughPlayers || isLoading}
        isLoading={isLoading}
        onClick={onDraw}
        leftIcon={<Shuffle className="w-5 h-5 stroke-[2.5]" />}
        rightIcon={<Sparkles className="w-4 h-4" />}
      >
        {hasEnoughPlayers
          ? `SORTEAR OS ${totalSelected} ATLETAS EQUILIBRADOS`
          : 'SELECIONE AO MENOS 2 ATLETAS'}
      </Button>
    </div>
  );
};
