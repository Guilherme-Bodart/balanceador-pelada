import React from 'react';
import { Player } from '../../types';
import { Badge } from '../common/Badge';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { Star, Edit2, Trash2, Check, ShieldAlert } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onRate?: (player: Player) => void;
  onEdit?: (player: Player) => void;
  onDelete?: (player: Player) => void;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (playerId: string) => void;
  isCustomGoalkeeper?: boolean;
  onToggleGoalkeeper?: (playerId: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onRate,
  onEdit,
  onDelete,
  selectable = false,
  isSelected = false,
  onToggleSelect,
  isCustomGoalkeeper,
  onToggleGoalkeeper,
}) => {
  // Se o modo customizado de goleiro foi informado, usa ele; senão usa o padrão cadastrado
  const isGk = isCustomGoalkeeper !== undefined ? isCustomGoalkeeper : player.position === 'GOALKEEPER';

  const handleCardClick = () => {
    if (selectable && onToggleSelect) {
      onToggleSelect(player.id);
    }
  };

  // Modo Seleção (Lista de Presença em 2 colunas para o Sorteio)
  if (selectable) {
    return (
      <div
        onClick={handleCardClick}
        className={`relative rounded-2xl p-2 sm:p-2.5 transition-all duration-200 border cursor-pointer select-none flex flex-col justify-between min-h-[76px] ${
          isSelected
            ? 'bg-emerald-950/40 border-emerald-500/70 shadow-glow-emerald ring-1 ring-emerald-500/50'
            : 'glass-card glass-card-hover border-slate-800/80 opacity-70 hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 w-full">
          {/* Checkbox de Seleção */}
          <div
            className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-lg flex items-center justify-center shrink-0 transition-all ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'border border-slate-700 bg-slate-850 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>

          {/* Avatar do Jogador com dimensões consistentes */}
          <PlayerAvatar
            name={player.name}
            photoUrl={player.photoUrl}
            size="sm"
            isGoalkeeper={isGk}
            className="shrink-0"
          />

          {/* Nome e Posição (Sem exibição de nota) */}
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-xs truncate leading-tight">
              {player.name}
            </h4>
            <div className="mt-0.5">
              <span className="text-[10px] text-slate-400 font-medium">
                {isGk ? '🧤 Goleiro' : '🏃 Linha'}
              </span>
            </div>
          </div>
        </div>

        {/* Barra Inferior: Botão para Trocar/Designar Goleiro nesta partida */}
        {isSelected && (
          <div className="mt-1.5 pt-1 border-t border-slate-800/60 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleGoalkeeper?.(player.id);
              }}
              title="Clique para alternar entre Goleiro e Linha para este jogo"
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                isGk
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>{isGk ? '🧤 Goleiro Hoje' : '🏃 Linha'}</span>
            </button>
            <span className="text-[9px] text-slate-500">Mudar</span>
          </div>
        )}
      </div>
    );
  }

  // Modo Gerenciamento (Cards da aba Jogadores - Sem exibir nota pública)
  return (
    <div className="relative rounded-2xl p-3 sm:p-3.5 transition-all duration-200 border glass-card glass-card-hover border-slate-800/80 w-full flex flex-col justify-between">
      <div className="flex items-center gap-3 w-full">
        {/* Avatar */}
        <PlayerAvatar
          name={player.name}
          photoUrl={player.photoUrl}
          size="md"
          isGoalkeeper={isGk}
        />

        {/* Informações do Atleta */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm truncate tracking-tight mb-1">
            {player.name}
          </h4>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={isGk ? 'amber' : 'slate'} size="sm">
              {isGk ? '🧤 Goleiro' : '🏃 Linha'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <button
          onClick={() => onRate?.(player)}
          className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>Votar Nota</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(player)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Editar jogador"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(player)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Excluir jogador"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
