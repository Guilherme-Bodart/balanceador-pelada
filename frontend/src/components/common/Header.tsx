import React from 'react';
import { Trophy, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3.5 transition-all">
      <div className="max-w-lg sm:max-w-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 p-0.5 shadow-glow-emerald flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white font-['Outfit']">
                SORTEADOR <span className="text-emerald-400">PRO</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pelada
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Equilíbrio e Snake Draft
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1.5">
          <Shield className="w-3.5 h-3.5 text-lime-400" />
          <span className="text-xs font-semibold text-slate-300">v1.0 Pro</span>
        </div>
      </div>
    </header>
  );
};
