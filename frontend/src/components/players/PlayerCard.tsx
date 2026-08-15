import React from 'react';
import { Player } from '../../types';
import { Badge } from '../common/Badge';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getRankInfo } from '../../constants/ranks';
import { Star, Edit2, Trash2, Check, ShieldAlert, Sparkles } from 'lucide-react';

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
  const isGk = isCustomGoalkeeper !== undefined ? isCustomGoalkeeper : player.position === 'GOALKEEPER';
  const rankInfo = getRankInfo(player.overallRating);
  const isSpecialRank = rankInfo.rank === 'SS' || rankInfo.rank === 'UR';

  const handleCardClick = () => {
    if (selectable && onToggleSelect) {
      onToggleSelect(player.id);
    }
  };

  // ================= MODO SELEÇÃO (Grid de 2 Colunas para o Sorteio) =================
  if (selectable) {
    return (
      <div
        onClick={handleCardClick}
        className={`relative rounded-2xl p-2.5 transition-all duration-300 border cursor-pointer select-none flex flex-col justify-between min-h-[92px] ${
          rankInfo.cardClass || ''
        } ${
          isSelected
            ? 'ring-2 ring-emerald-500 shadow-glow-emerald bg-slate-900/90'
            : `${rankInfo.cardBg} ${rankInfo.cardBorder} hover:brightness-110`
        }`}
      >
        {/* Topo do Card de Seleção: Checkbox + Selo do Rank + Média */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            {/* Checkbox de Seleção */}
            <div
              className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-lg flex items-center justify-center shrink-0 transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'border border-slate-700 bg-slate-850 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>

            {/* Selo do Rank */}
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black font-mono tracking-wider border shadow-sm ${
                rankInfo.badgeBg
              } ${rankInfo.badgeText} ${rankInfo.badgeBorder}`}
            >
              {rankInfo.rank}
            </span>
          </div>

          {/* Média Numérica */}
          <div className="flex items-center gap-0.5 text-[11px] font-mono font-black text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-slate-800">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>{player.overallRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Corpo: Avatar + Nome + Posição */}
        <div className="flex items-center gap-2 w-full">
          <div
            className="rounded-full p-0.5 border shrink-0"
            style={{ borderColor: rankInfo.accentColor }}
          >
            <PlayerAvatar
              name={player.name}
              photoUrl={player.photoUrl}
              size="sm"
              isGoalkeeper={isGk}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-white text-xs truncate leading-tight">
              {player.name}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {isGk ? '🧤 Goleiro' : rankInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Trocar Goleiro quando selecionado */}
        {isSelected && (
          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
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
            <span className="text-[9px] text-slate-500">Alternar</span>
          </div>
        )}
      </div>
    );
  }

  // ================= MODO CARTA RPG (Aba de Jogadores / Elenco) =================
  return (
    <div
      className={`relative rounded-3xl p-3.5 sm:p-4 transition-all duration-300 border flex flex-col justify-between shadow-card-elevated ${
        rankInfo.cardClass || ''
      } ${rankInfo.cardBg} ${rankInfo.cardBorder} ${rankInfo.cardGlow} hover:scale-[1.01]`}
    >
      {/* Topo da Carta: Selo de Rank + Média Numérica + Posição */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          {/* Selo do Rank */}
          <div
            className={`px-2 py-0.5 rounded-lg text-xs font-black font-mono tracking-wider border shadow-sm flex items-center gap-1 ${
              rankInfo.badgeBg
            } ${rankInfo.badgeText} ${rankInfo.badgeBorder} ${
              isSpecialRank ? 'animate-pulse' : ''
            }`}
          >
            {isSpecialRank && <Sparkles className="w-3 h-3 text-yellow-300" />}
            <span>RANK {rankInfo.rank}</span>
          </div>

          <Badge variant={isGk ? 'amber' : 'slate'} size="sm">
            {isGk ? '🧤 Goleiro' : '🏃 Linha'}
          </Badge>
        </div>

        {/* Média Numérica Geral */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-700/80 font-mono font-black text-sm text-amber-300 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{player.overallRating.toFixed(1)}</span>
        </div>
      </div>

      {/* Centro da Carta: Avatar com Moldura de Rank + Nome e Interpretação */}
      <div className="flex items-center gap-3 py-1">
        <div
          className="rounded-2xl p-1 border shadow-inner shrink-0"
          style={{ borderColor: rankInfo.accentColor }}
        >
          <PlayerAvatar
            name={player.name}
            photoUrl={player.photoUrl}
            size="md"
            isGoalkeeper={isGk}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-black text-white text-sm sm:text-base truncate tracking-tight">
            {player.name}
          </h4>

          {/* Rótulo de Interpretação do Rank */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className="text-xs font-bold tracking-tight"
              style={{ color: rankInfo.accentColor }}
            >
              {rankInfo.label}
            </span>
            <span className="text-[10px] text-slate-400">
              • {player.ratingCount === 0 ? 'Sem avaliações' : `${player.ratingCount} avaliações`}
            </span>
          </div>
        </div>
      </div>

      {/* Ações da Carta */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => onRate?.(player)}
          className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-sm"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>Avaliar</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(player)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Editar jogador"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(player)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors"
            title="Excluir jogador"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
