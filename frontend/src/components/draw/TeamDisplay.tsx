import React from 'react';
import { DrawResponse, Player } from '../../types';
import { Badge } from '../common/Badge';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { ShieldAlert, Share2, CheckCircle2, AlertTriangle, UserCheck, RefreshCw, Scale } from 'lucide-react';
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
  const { teamA, teamB, reserves, differenceScore, advantageTeam, isEquilibrado } = result;

  const renderPlayerRow = (player: Player | null, index: number | string, isGk: boolean = false) => {
    if (!player) {
      return (
        <div className="h-11 sm:h-12 p-2 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex items-center justify-center text-[11px] text-slate-500 italic">
          {isGk ? 'Sem goleiro fixo' : 'Vago'}
        </div>
      );
    }

    return (
      <div
        className={`h-11 sm:h-12 px-2 py-1.5 rounded-xl border transition-colors flex items-center justify-between gap-1.5 ${
          isGk
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-slate-900/80 border-slate-800/90 hover:bg-slate-850'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          {/* Indicador de Posição / Número */}
          <span
            className={`text-[10px] font-mono font-black w-4 text-center shrink-0 ${
              isGk ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            {isGk ? '🧤' : index}
          </span>

          {/* Avatar com tamanho estrito */}
          <PlayerAvatar
            name={player.name}
            photoUrl={player.photoUrl}
            size="xs"
            isGoalkeeper={isGk}
            className="shrink-0"
          />

          {/* Nome do Atleta */}
          <div className="min-w-0 flex-1">
            <span
              className={`block text-[11px] sm:text-xs font-semibold truncate ${
                isGk ? 'text-amber-200' : 'text-slate-200'
              }`}
            >
              {player.name}
            </span>
          </div>
        </div>

        {/* Badge de Posição Discreto */}
        <span
          className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${
            isGk
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}
        >
          {isGk ? 'Goleiro' : 'Linha'}
        </span>
      </div>
    );
  };

  // Garante que ambos os lados tenham a mesma quantidade de linhas renderizadas
  const maxFieldRows = Math.max(teamA.fieldPlayers.length, teamB.fieldPlayers.length);

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

      {/* Duelo de Times: 2 Listas Lado a Lado com "X" no meio */}
      <div className="relative glass-panel rounded-3xl p-2.5 sm:p-4 border border-slate-800 shadow-card-elevated">
        {/* Emblema "X" Centralizado no topo dos times */}
        <div className="absolute left-1/2 top-5 -translate-x-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950 border-2 border-emerald-500/80 shadow-glow-emerald flex items-center justify-center">
          <span className="font-black text-xs sm:text-sm text-emerald-400 font-['Outfit']">
            X
          </span>
        </div>

        {/* Grid Lado a Lado (2 Colunas) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* ================= TIME 1 (ESQUERDA) ================= */}
          <div className="space-y-2.5">
            {/* Header Time 1 */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-slate-900 border border-emerald-500/40 text-left min-h-[58px] flex flex-col justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs">🟢</span>
                <h3 className="font-extrabold text-white text-xs sm:text-sm tracking-tight truncate">
                  Time 1
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {teamA.totalPlayers} atletas escalados
              </span>
            </div>

            {/* Seção Goleiro Time 1 */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 px-1">
                <ShieldAlert className="w-2.5 h-2.5" />
                Goleiro
              </span>
              {renderPlayerRow(teamA.goalkeeper, 'G', true)}
            </div>

            {/* Seção Linha Time 1 */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Linha ({teamA.fieldPlayers.length})
              </span>
              <div className="space-y-1.5">
                {Array.from({ length: maxFieldRows }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    {renderPlayerRow(teamA.fieldPlayers[idx] || null, idx + 1, false)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ================= TIME 2 (DIREITA) ================= */}
          <div className="space-y-2.5">
            {/* Header Time 2 */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-sky-950/90 to-slate-900 border border-sky-500/40 text-left min-h-[58px] flex flex-col justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs">🔵</span>
                <h3 className="font-extrabold text-white text-xs sm:text-sm tracking-tight truncate">
                  Time 2
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {teamB.totalPlayers} atletas escalados
              </span>
            </div>

            {/* Seção Goleiro Time 2 */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 px-1">
                <ShieldAlert className="w-2.5 h-2.5" />
                Goleiro
              </span>
              {renderPlayerRow(teamB.goalkeeper, 'G', true)}
            </div>

            {/* Seção Linha Time 2 */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Linha ({teamB.fieldPlayers.length})
              </span>
              <div className="space-y-1.5">
                {Array.from({ length: maxFieldRows }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    {renderPlayerRow(teamB.fieldPlayers[idx] || null, idx + 1, false)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banco de Reservas / Próximos da Fila (se houver) */}
      {reserves.length > 0 && (
        <div className="glass-panel rounded-2xl p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              Banco de Reservas / Próximos ({reserves.length})
            </span>
            <Badge variant="purple" size="sm">Próximo Jogo</Badge>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {reserves.map((p) => (
              <div
                key={p.id}
                className="h-10 px-2 py-1 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-1 text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <PlayerAvatar name={p.name} photoUrl={p.photoUrl} size="xs" />
                  <span className="text-slate-300 font-medium text-[11px] truncate">{p.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium shrink-0">
                  {p.position === 'GOALKEEPER' ? '🧤 Gol' : '🏃 Linha'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
