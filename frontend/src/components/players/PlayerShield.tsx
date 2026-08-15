import React from 'react';
import { Player } from '../../types';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getRankInfo } from '../../constants/ranks';
import { Star } from 'lucide-react';

interface PlayerShieldProps {
  player: Player | null;
  isGoalkeeper?: boolean;
  numberLabel?: string | number;
  className?: string;
}

export const PlayerShield: React.FC<PlayerShieldProps> = ({
  player,
  isGoalkeeper = false,
  numberLabel,
  className = '',
}) => {
  if (!player) {
    return (
      <div className={`player-shield-wrapper ${className}`}>
        <div className="player-shield-shape border border-dashed border-slate-800 p-2 text-center flex flex-col items-center justify-center min-h-[90px]">
          <span className="text-[10px] text-slate-500 italic">
            {isGoalkeeper ? 'Sem Goleiro' : 'Vaga Livre'}
          </span>
        </div>
      </div>
    );
  }

  const rankInfo = getRankInfo(player.overallRating);
  const isSpecialRank = rankInfo.rank === 'SS' || rankInfo.rank === 'UR';

  return (
    <div className={`player-shield-wrapper group ${className}`}>
      {/* Container Principal em Formato de Escudo */}
      <div
        className={`player-shield-shape border p-2 sm:p-2.5 flex flex-col items-center justify-between text-center min-h-[105px] sm:min-h-[115px] transition-all duration-300 ${
          rankInfo.shieldGlowClass
        }`}
        style={{
          borderColor: rankInfo.shieldBorderColor,
        }}
      >
        {/* Topo do Escudo: Badge do Rank em Destaque + Número */}
        <div className="w-full flex items-center justify-between gap-1 mb-1">
          {/* Indicador de Número ou Luva */}
          <span className="text-[10px] font-mono font-black text-slate-400">
            {isGoalkeeper ? '🧤' : numberLabel}
          </span>

          {/* Selo do Rank (S, SS, UR, etc.) */}
          <div
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono tracking-wider border shadow-sm flex items-center gap-0.5 ${
              rankInfo.shieldBadgeBg
            } ${isSpecialRank ? 'animate-pulse' : ''}`}
          >
            <span>{rankInfo.rank}</span>
          </div>
        </div>

        {/* Centro do Escudo: Foto do Jogador */}
        <div className="relative my-0.5">
          <div
            className="rounded-full p-0.5 border"
            style={{ borderColor: rankInfo.shieldBorderColor }}
          >
            <PlayerAvatar
              name={player.name}
              photoUrl={player.photoUrl}
              size="sm"
              isGoalkeeper={isGoalkeeper}
              className="group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Mini Estrela da Média Numérica */}
          <div className="absolute -bottom-1 -right-1 bg-slate-950/90 border border-slate-700 rounded-full px-1 py-0.2 flex items-center gap-0.5 text-[8px] font-mono font-bold text-amber-300">
            <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
            <span>{player.overallRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Base do Escudo: Nome Resumido + Posição */}
        <div className="w-full mt-1">
          <h5
            className="font-extrabold text-[11px] sm:text-xs text-white truncate max-w-full leading-tight"
            title={player.name}
          >
            {player.name}
          </h5>
          <span
            className={`text-[9px] font-semibold tracking-tight block truncate mt-0.5 ${
              isGoalkeeper ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            {isGoalkeeper ? 'Goleiro' : rankInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};
