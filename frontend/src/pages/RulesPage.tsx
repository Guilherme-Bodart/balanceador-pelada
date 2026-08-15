import React from 'react';
import { Shield, Sparkles, Scale, Trophy, CheckCircle, Zap } from 'lucide-react';
import { RANKS_MAP, PlayerRank } from '../constants/ranks';

export const RulesPage: React.FC = () => {
  const rankList: { range: string; rank: PlayerRank }[] = [
    { range: '10.0', rank: 'UR' },
    { range: '9.1 a 9.9', rank: 'SS' },
    { range: '8.1 a 9.0', rank: 'S' },
    { range: '7.1 a 8.0', rank: 'A+' },
    { range: '6.1 a 7.0', rank: 'A' },
    { range: '4.6 a 6.0', rank: 'B' },
    { range: '2.1 a 4.5', rank: 'C' },
    { range: '0.5 a 2.0', rank: 'D' },
  ];

  return (
    <div className="space-y-4 max-w-lg sm:max-w-xl mx-auto px-3 sm:px-4 pb-4 text-slate-300 text-xs leading-relaxed">
      {/* Header Informativo */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-white text-base">
          Como funciona o Algoritmo Pro?
        </h3>
        <p className="text-slate-400 text-xs">
          O sistema combina balanceamento matemático (Snake Draft + Otimizador de Trocas) com um sistema gamificado de Ranks inspirado em RPGs e cards colecionáveis.
        </p>
      </div>

      {/* Tabela de Gamificação de Ranks */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>Tabela Oficial de Ranks & Interpretações</span>
        </div>
        <p className="text-slate-400 text-[11px]">
          A média geral de cada jogador é convertida automaticamente em um Rank colecionável com moldura e efeitos visuais exclusivos:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {rankList.map(({ range, rank }) => {
            const info = RANKS_MAP[rank];
            const isSpecial = rank === 'SS' || rank === 'UR';

            return (
              <div
                key={rank}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  info.cardBg
                } ${info.cardBorder} ${isSpecial ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-black font-mono tracking-wider border ${
                      info.badgeBg
                    } ${info.badgeText} ${info.badgeBorder}`}
                  >
                    {rank}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-white block text-xs truncate">
                      {info.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {info.description}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-300 shrink-0 bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-slate-800">
                  {range}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regra 1: Separação de Goleiros */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Shield className="w-4 h-4" />
          <span>1. Separação de Goleiros Fixos</span>
        </div>
        <p>
          Os atletas marcados como <strong>Goleiro Fixo</strong> são identificados primeiro. O sistema aloca 1 goleiro para o Time 1 e 1 para o Time 2. Se houver disparidade entre eles, o algoritmo compensa na distribuição dos jogadores de linha!
        </p>
      </div>

      {/* Regra 2: Snake Draft & Otimização de Trocas */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>2. Snake Draft + Minimização de Disparidade</span>
        </div>
        <p>
          Os jogadores de linha são distribuídos no padrão serpente e refinados por um otimizador matemático guloso (Swap Minimization) para atingir a menor diferença de pontuação possível entre as equipes.
        </p>
      </div>

      {/* Checklist de Qualidade */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2.5">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-emerald-400" />
          Diferenciais do Sorteador Pro
        </h4>
        <ul className="space-y-1.5 text-[11px] text-slate-300">
          <li className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Fim dos "times panelinha" e discussões na pelada.</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Cálculo matemático de equilíbrio com visualização em Escudos.</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Compartilhamento instantâneo com Ranks no WhatsApp.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
