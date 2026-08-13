import React from 'react';
import { Users, Shuffle, Info } from 'lucide-react';

export type TabType = 'players' | 'draw' | 'rules';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  selectedCount = 0,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pointer-events-none">
      <nav className="max-w-lg sm:max-w-xl mx-auto pointer-events-auto glass-modal border border-slate-700/60 rounded-3xl p-1.5 shadow-card-elevated flex items-center justify-around">
        {/* Aba Jogadores */}
        <button
          onClick={() => onTabChange('players')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'players'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Jogadores</span>
        </button>

        {/* Aba Sorteio (Principal) */}
        <button
          onClick={() => onTabChange('draw')}
          className={`flex-1 relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'draw'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shuffle className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Sortear Times</span>
          {selectedCount > 0 && activeTab !== 'draw' && (
            <span className="absolute top-1 right-3.5 bg-lime-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {selectedCount}
            </span>
          )}
        </button>

        {/* Aba Regras / Info */}
        <button
          onClick={() => onTabChange('rules')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'rules'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Regras</span>
        </button>
      </nav>
    </div>
  );
};
