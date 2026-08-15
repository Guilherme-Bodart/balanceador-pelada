import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../../types';
import { Shuffle, ShieldAlert, Sparkles, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface DrawLoadingOverlayProps {
  isOpen: boolean;
  players: Player[];
  onComplete?: () => void;
}

const STEPS = [
  {
    pct: 25,
    title: 'Analisando Scouts & Atributos',
    desc: 'Processando notas técnicas (Skill) e condicionamento físico...',
    icon: Activity,
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
  },
  {
    pct: 60,
    title: 'Alocando Goleiros & Linhas',
    desc: 'Distribuindo luvas e definindo pilares defensivos...',
    icon: ShieldAlert,
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
  },
  {
    pct: 88,
    title: 'Otimizando Equilíbrio Matemático',
    desc: 'Rodando Swap Minimization para evitar disparidade...',
    icon: Zap,
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
  },
  {
    pct: 100,
    title: 'Escalações Concluídas!',
    desc: 'Times Vermelho e Azul prontos para o confronto!',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
  },
];

export const DrawLoadingOverlay: React.FC<DrawLoadingOverlayProps> = ({
  isOpen,
  players,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [roulettePlayerIdx, setRoulettePlayerIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIdx(0);
      return;
    }

    // Roleta de jogadores (troca rápida a cada 120ms para efeito FIFA Pack/Scout)
    const rouletteInterval = setInterval(() => {
      if (players.length > 0) {
        setRoulettePlayerIdx((prev) => (prev + 1) % players.length);
      }
    }, 120);

    // Progresso suave
    const startTime = Date.now();
    const DURATION = 2200; // 2.2 segundos de animação imersiva

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / DURATION) * 100), 100);
      setProgress(pct);

      if (pct < 30) {
        setCurrentStepIdx(0);
      } else if (pct < 65) {
        setCurrentStepIdx(1);
      } else if (pct < 95) {
        setCurrentStepIdx(2);
      } else {
        setCurrentStepIdx(3);
      }

      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 30);

    return () => {
      clearInterval(rouletteInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, players.length]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIdx];
  const activePlayer = players[roulettePlayerIdx] || players[0];
  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl select-none"
      >
        {/* Glow de Fundo Pulsante */}
        <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-purple-600/20 via-emerald-500/20 to-cyan-500/20 blur-3xl pointer-events-none animate-pulse" />

        <motion.div
          initial={{ scale: 0.9, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center space-y-5 overflow-hidden"
        >
          {/* Luz Orbital no Topo */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-emerald-500/30 blur-2xl pointer-events-none" />

          {/* ================= RADAR / DUEL ORB ANIMATION ================= */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Anéis Giratórios de Radar */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-[spin_4s_linear_infinite_reverse]" />
            <div className="absolute inset-4 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
              {/* Foto rápida do atleta sorteado na roleta */}
              {activePlayer?.photoUrl ? (
                <motion.img
                  key={activePlayer.id}
                  src={activePlayer.photoUrl}
                  alt={activePlayer.name}
                  initial={{ scale: 0.7, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <Shuffle className="w-8 h-8 text-emerald-400 animate-spin" />
              )}
            </div>

            {/* Partículas de Duelo Orbitando (Vermelho vs Azul) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_10px_#ef4444]" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9]" />
            </motion.div>
          </div>

          {/* ================= NOME DO ATLETA SENDO ESCANEADO ================= */}
          {activePlayer && (
            <div className="h-6 flex items-center justify-center">
              <motion.span
                key={activePlayer.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-black uppercase tracking-wider text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full border border-white/10 font-mono"
              >
                ⚽ Sorteando: <span className="text-emerald-400">{activePlayer.name}</span>
              </motion.span>
            </div>
          )}

          {/* ================= TÍTULO E DESCRIÇÃO DO PASSO ATUAL ================= */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
              <StepIcon className={`w-4 h-4 ${currentStep.color} animate-bounce`} />
              <span className={`text-xs font-bold ${currentStep.color}`}>
                {currentStep.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {currentStep.desc}
            </p>
          </div>

          {/* ================= BARRA DE PROGRESSO COM SHIMMER ================= */}
          <div className="w-full space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Otimizador Inteligente</span>
              </span>
              <span className="font-bold text-white tabular-nums">{progress}%</span>
            </div>

            <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Efeito Shimmering Passando */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.2s_infinite]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
