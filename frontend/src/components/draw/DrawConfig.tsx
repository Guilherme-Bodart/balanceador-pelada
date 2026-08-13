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
  playersPerTeam,
  onPlayersPerTeamChange,
  totalSelected,
  totalGoalkeepers,
  onDraw,
  isLoading,
  onSelectAll,
  onDeselectAll,
  isAllSelected,
}) => {
  const neededPlayers = playersPerTeam * 2;
  const hasEnoughPlayers = totalSelected >= neededPlayers;
  const presets = [4, 5, 6, 7, 8, 11];

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-800 space-y-4 mb-4 shadow-card-elevated">
      {/* Linha 1: Seletor de Formato (5x5, 6x6...) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Formato da Partida
          </label>
          <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            {playersPerTeam} x {playersPerTeam} ({neededPlayers} em campo)
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {presets.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onPlayersPerTeamChange(count)}
              className={`py-2 rounded-xl text-xs font-bold font-mono transition-all duration-150 ${
                playersPerTeam === count
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald scale-105'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {count}x{count}
            </button>
          ))}
        </div>
      </div>

      {/* Linha 2: Resumo de Seleção e Avisos */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selecionados:</span>
            <span
              className={`font-black font-mono px-2 py-0.5 rounded-md ${
                hasEnoughPlayers
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {totalSelected} / {neededPlayers} mín.
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>
              Goleiros: <strong className="text-amber-400">{totalGoalkeepers}</strong>{' '}
              {totalGoalkeepers < 2 ? '(recomendado 2)' : '✔️'}
            </span>
          </div>
        </div>

        {/* Botão Selecionar Todos / Desmarcar */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-colors"
          >
            {isAllSelected ? (
              <>
                <Square className="w-3 h-3" />
                Desmarcar
              </>
            ) : (
              <>
                <CheckSquare className="w-3 h-3 text-emerald-400" />
                Todos
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
          ? 'SORTEAR TIMES EQUILIBRADOS'
          : `SELECIONE MAIS ${neededPlayers - totalSelected} JOGADOR(ES)`}
      </Button>
    </div>
  );
};
