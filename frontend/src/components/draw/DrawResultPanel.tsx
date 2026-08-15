import React, { useEffect } from 'react';
import { DrawResponse, Team, Player } from '../../types';
import { getRankInfo } from '../../constants/ranks';
import { motion } from 'framer-motion';
import { Share2, RotateCcw, Scale, Star } from 'lucide-react';
import { Button } from '../common/Button';
import confetti from 'canvas-confetti';

interface DrawResultPanelProps {
  drawResult: DrawResponse;
  onDrawAgain: () => void;
  onShare: () => void;
  isLoading?: boolean;
}

export const DrawResultPanel: React.FC<DrawResultPanelProps> = ({
  drawResult,
  onDrawAgain,
  onShare,
  isLoading = false,
}) => {
  const { teamA, teamB, differenceScore, isEquilibrado } = drawResult;

  // Efeito de Confetes ao carregar o resultado do sorteio
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#3b82f6', '#10b981', '#fbbf24', '#ffffff'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  }, [drawResult]);

  // Cálculo de Médias dos Times
  const calculateTeamAverage = (team: Team): number => {
    const allPlayers: Player[] = [];
    if (team.goalkeeper) allPlayers.push(team.goalkeeper);
    allPlayers.push(...team.fieldPlayers);
    if (allPlayers.length === 0) return 0;
    const total = allPlayers.reduce((acc, p) => acc + p.overallRating, 0);
    return total / allPlayers.length;
  };

  const avgTeamA = calculateTeamAverage(teamA);
  const avgTeamB = calculateTeamAverage(teamB);

  // Renderização de Card de Jogador no Time
  const renderPlayerItem = (player: Player, isGk: boolean = false) => {
    const rankTheme = getRankInfo(player.overallRating);
    return (
      <motion.div
        key={player.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between p-2 rounded-xl border backdrop-blur-md transition-all ${
          isGk
            ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Escudo / Avatar */}
          <div
            className="w-8 h-8 rounded-full p-0.5 border flex items-center justify-center shrink-0 overflow-hidden bg-slate-950"
            style={{ borderColor: rankTheme.borderHex }}
          >
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xs font-black text-white">
                {player.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <span className="text-xs font-bold text-white uppercase truncate block leading-tight">
              {player.name}
            </span>
            <span className="text-[10px] text-slate-400">
              {isGk ? '🧤 Goleiro' : '🏃 Linha'}
            </span>
          </div>
        </div>

        {/* Rank & Nota */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-black ${rankTheme.badgeBg} ${rankTheme.badgeText}`}
          >
            {rankTheme.rank}
          </span>
          <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-mono font-black text-white">
              {player.overallRating.toFixed(1)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 max-w-4xl mx-auto px-3 sm:px-6 pb-20"
    >
      {/* ================= BANNER DO PLACAR DE EQUILÍBRIO ================= */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-800 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Scale className="w-3.5 h-3.5" />
            <span>{isEquilibrado ? 'Equilíbrio Perfeito' : 'Vantagem Leve'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-sans">
            Times Sorteados e Equilibrados
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Diferença técnica de apenas{' '}
            <strong className="text-emerald-400 font-mono">
              {differenceScore.toFixed(2)} pts
            </strong>{' '}
            entre as duas equipes.
          </p>
        </div>
      </div>

      {/* ================= TIMES LADO A LADO (TIME VERMELHO 🔴 VS TIME AZUL 🔵) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TIME VERMELHO 🔴 */}
        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-b from-red-950/20 to-slate-900/80 p-4 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex flex-col justify-between">
          <div>
            {/* Header do Time Vermelho */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-red-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  🔴
                </div>
                <div>
                  <h3 className="font-black text-base text-white uppercase tracking-tight">
                    Time Vermelho
                  </h3>
                  <span className="text-[11px] text-red-300 font-semibold">
                    {teamA.fieldPlayers.length + (teamA.goalkeeper ? 1 : 0)} Atletas
                  </span>
                </div>
              </div>

              {/* Média do Time */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Média Técnica
                </span>
                <span className="text-lg font-black font-mono text-red-400">
                  {avgTeamA.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Lista de Atletas do Time Vermelho */}
            <div className="space-y-2">
              {teamA.goalkeeper && renderPlayerItem(teamA.goalkeeper, true)}
              {teamA.fieldPlayers.map((p) => renderPlayerItem(p, false))}
            </div>
          </div>
        </div>

        {/* TIME AZUL 🔵 */}
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-900/80 p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col justify-between">
          <div>
            {/* Header do Time Azul */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  🔵
                </div>
                <div>
                  <h3 className="font-black text-base text-white uppercase tracking-tight">
                    Time Azul
                  </h3>
                  <span className="text-[11px] text-blue-300 font-semibold">
                    {teamB.fieldPlayers.length + (teamB.goalkeeper ? 1 : 0)} Atletas
                  </span>
                </div>
              </div>

              {/* Média do Time */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Média Técnica
                </span>
                <span className="text-lg font-black font-mono text-blue-400">
                  {avgTeamB.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Lista de Atletas do Time Azul */}
            <div className="space-y-2">
              {teamB.goalkeeper && renderPlayerItem(teamB.goalkeeper, true)}
              {teamB.fieldPlayers.map((p) => renderPlayerItem(p, false))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTÕES DE AÇÃO: REFAZER E COMPARTILHAR ================= */}
      <div className="flex items-center justify-center gap-3 pt-3">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onDrawAgain}
          disabled={isLoading}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="rounded-2xl border border-slate-700/80"
        >
          Sortear Novamente
        </Button>

        <Button
          type="button"
          variant="glow"
          size="lg"
          onClick={onShare}
          leftIcon={<Share2 className="w-4 h-4" />}
          className="rounded-2xl"
        >
          Compartilhar no WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};
