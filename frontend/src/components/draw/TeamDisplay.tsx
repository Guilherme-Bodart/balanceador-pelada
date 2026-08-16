import React from 'react';
import { DrawResponse, Player } from '../../types';
import { Badge } from '../common/Badge';
import { PlayerShield } from '../players/PlayerShield';
import { getRankInfo } from '../../constants/ranks';
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

  const renderShield = (player: Player, isGk: boolean = false) => {
    const rankInfo = getRankInfo(player.overallRating);
    return (
      <PlayerShield
        key={player.id}
        name={player.name}
        position={isGk ? 'GOLEIRO' : 'LINHA'}
        rating={player.overallRating}
        grade={rankInfo.rank}
        photoUrl={player.photoUrl || undefined}
        accent={rankInfo.colorHex}
        accentAlt={rankInfo.borderHex}
        badge={isGk ? 'GOLEIRO' : undefined}
        stats={[
          {
            label: 'SKL',
            value: (player.skillRatingCount > 0 || player.skillRating > 0) ? String(Math.round(player.skillRating * 10)) : '—',
          },
          {
            label: 'FIS',
            value: (player.physicalRatingCount > 0 || player.physicalRating > 0) ? String(Math.round(player.physicalRating * 10)) : '—',
          },
        ]}
        className="w-full max-w-[200px] mx-auto h-auto"
      />
    );
  };

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
        <div className="flex items-center gap-2">
          {isEquilibrado ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div className="text-xs">
            <span className="font-black tracking-wide block">
              {isEquilibrado ? 'TIMES EQUILIBRADOS' : 'LEVE VANTAGEM'}
            </span>
            <span className="text-[11px] opacity-80">
              Diferença técnica: <strong>{differenceScore.toFixed(1)} pts</strong>
            </span>
          </div>
        </div>

        {advantageTeam && (
          <Badge variant="emerald" size="sm">
            <Scale className="w-3 h-3 mr-1" />
            {advantageTeam}
          </Badge>
        )}
      </div>

      {/* Painel Principal de Comparação dos 2 Times Lado a Lado */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* ================= TIME 1 (ESQUERDA) ================= */}
          <div className="space-y-3">
            {/* Header Time 1 */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-rose-950/90 to-slate-900 border border-rose-500/40 text-left min-h-[58px] flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🔴</span>
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
                {renderShield(teamA.goalkeeper, true)}
              </div>
            )}

            {/* Jogadores de Linha Time 1 em Escudos */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Linha ({teamA.fieldPlayers.length})
              </span>
              <div className="grid grid-cols-1 gap-2">
                {teamA.fieldPlayers.map((player) => renderShield(player, false))}
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
                {renderShield(teamB.goalkeeper, true)}
              </div>
            )}

            {/* Jogadores de Linha Time 2 em Escudos */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Linha ({teamB.fieldPlayers.length})
              </span>
              <div className="grid grid-cols-1 gap-2">
                {teamB.fieldPlayers.map((player) => renderShield(player, false))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação do Sorteio */}
      <div className="flex gap-2.5 pt-1">
        <Button
          variant="ghost"
          size="md"
          onClick={onRedraw}
          className="flex-1 rounded-2xl border border-slate-700 hover:bg-slate-800"
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Sortear Novamente
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onOpenShare}
          className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
          leftIcon={<Share2 className="w-4 h-4" />}
        >
          Compartilhar
        </Button>
      </div>
    </div>
  );
};
