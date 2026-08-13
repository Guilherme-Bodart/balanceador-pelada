import React from 'react';
import { Shield, Sparkles, Scale, Trophy, Star, CheckCircle } from 'lucide-react';

export const RulesPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-lg sm:max-w-xl mx-auto px-3 sm:px-4 pb-2 text-slate-300 text-xs leading-relaxed">
      {/* Header Informativo */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-white text-base">
          Como funciona o Algoritmo Pro?
        </h3>
        <p className="text-slate-400 text-xs">
          O sistema utiliza balanceamento inteligente com o método Snake Draft e otimização por troca para garantir jogos equilibrados.
        </p>
      </div>

      {/* Regra 1: Separação de Goleiros */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Shield className="w-4 h-4" />
          <span>1. Separação de Goleiros Fixos</span>
        </div>
        <p>
          Os atletas marcados como <strong>Goleiro Fixo</strong> são identificados primeiro. O sistema aloca 1 goleiro para o Time A e 1 para o Time B. Se houver disparidade entre eles, o algoritmo compensa na distribuição dos jogadores de linha!
        </p>
      </div>

      {/* Regra 2: Snake Draft & Otimização de Trocas */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>2. Snake Draft + Minimização de Disparidade</span>
        </div>
        <p>
          Os jogadores de linha são ordenados pela média das notas. A distribuição inicial segue o padrão serpente (A, B, B, A...). Em seguida, um otimizador matemático busca as melhores permutações para que a soma total das notas de ambos os times tenha a menor diferença absoluta possível.
        </p>
      </div>

      {/* Regra 3: Sistema de Notas e Média 5.0 */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
          <Star className="w-4 h-4" />
          <span>3. Sistema de Notas e Média Padrão (5.0)</span>
        </div>
        <p>
          Qualquer participante pode receber notas de 1.0 a 10.0. Caso um jogador recém-cadastrado ainda não possua nenhuma nota registrada, o sistema assume automaticamente a nota neutra padrão de <strong>5.0</strong>.
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
            <span>Cálculo matemático transparente de médias e somas.</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Compartilhamento instantâneo e formatado no WhatsApp.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
