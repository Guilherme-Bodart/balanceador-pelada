import React from 'react';
import { Shield, Sparkles, Scale, Zap } from 'lucide-react';
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
    <div className="space-y-4 max-w-lg sm:max-w-2xl mx-auto px-3 sm:px-6 pb-24 text-slate-300 text-xs leading-relaxed">
      {/* Header Informativo */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-white text-base">
          Como funciona o Algoritmo FIFA Pro?
        </h3>
        <p className="text-slate-400 text-xs">
          O sistema combina balanceamento matemático (Snake Draft + Otimizador de Trocas) com um sistema de Ranks e Escudos esportivos.
        </p>
      </div>

      {/* Tabela de Ranks */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>Tabela Oficial de Ranks & Interpretações</span>
        </div>
        <p className="text-slate-400 text-[11px]">
          A média geral de cada jogador define automaticamente seu Rank e badge visual:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {rankList.map(({ range, rank }) => {
            const info = RANKS_MAP[rank];

            return (
              <div
                key={rank}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  info.rulesCardBg
                } ${info.rulesCardBorder}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-black tracking-wider ${
                      info.rulesBadgeBg
                    } ${info.rulesBadgeText} ${info.rulesBadgeBorder}`}
                  >
                    {rank}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-white block text-xs truncate">
                      {info.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {info.subtitle}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-300 shrink-0 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                  {range}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regra 1: Separação de Goleiros */}
      <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Shield className="w-4 h-4" />
          <span>1. Separação de Goleiros Fixos</span>
        </div>
        <p>
          Os atletas marcados com luva (<strong>🧤 Goleiro</strong>) são alocados estrategicamente entre os times. Se houver disparidade entre eles, o algoritmo compensa na distribuição dos jogadores de linha!
        </p>
      </div>

      {/* Regra 2: Votação Independente de Skill e Físico */}
      <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>2. Votação Independente: Skill (60%) & Físico (40%)</span>
        </div>
        <p>
          Os participantes do elenco podem votar anonimamente nas duas características do atleta ao longo do mês:
        </p>
        <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-400">
          <li><strong>⚡ Skill (Habilidade Técnica - 60% peso)</strong>: controle de bola, passe, drible e finalização.</li>
          <li><strong>🏃 Físico (Condicionamento - 40% peso)</strong>: fôlego, velocidade e intensidade.</li>
          <li><strong>Regra do 0 (Pular)</strong>: se uma categoria estiver com nota 0, ela <strong>não é contabilizada</strong> no cálculo daquele atributo e não gasta o voto do ciclo.</li>
          <li><strong>Votação Flexível</strong>: você pode votar apenas no Físico, apenas na Skill ou em ambos simultaneamente.</li>
        </ul>
      </div>

      {/* Regra 3: Snake Draft & Otimização de Trocas */}
      <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>3. Snake Draft + Minimização de Disparidade</span>
        </div>
        <p>
          Os jogadores de linha são distribuídos no padrão serpente e refinados por um otimizador matemático guloso (Swap Minimization) para atingir a menor diferença de pontuação possível entre as duas equipes.
        </p>
      </div>
    </div>
  );
};
