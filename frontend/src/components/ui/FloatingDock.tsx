import React from 'react';
import { Users, Shuffle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'players' | 'draw' | 'rules';

interface FloatingDockProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCount?: number;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeTab,
  onTabChange,
  selectedCount = 0,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'players', label: 'Jogadores', icon: <Users className="w-5 h-5" /> },
    { id: 'draw', label: 'Sorteio', icon: <Shuffle className="w-5 h-5" /> },
    { id: 'rules', label: 'Regras', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-full p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center gap-2 py-2 px-4 rounded-full text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-dock-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-500/90 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="relative z-10 font-sans tracking-wide">
                {item.label}
              </span>

              {item.id === 'draw' && selectedCount > 0 && (
                <span className="relative z-10 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {selectedCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
