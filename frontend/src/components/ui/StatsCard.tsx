import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'sky';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  variant = 'emerald',
}) => {
  const variantStyles = {
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bg: 'bg-gradient-to-b from-emerald-950/20 to-slate-900/60',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      bg: 'bg-gradient-to-b from-amber-950/20 to-slate-900/60',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    },
    sky: {
      border: 'border-sky-500/30 hover:border-sky-500/60',
      bg: 'bg-gradient-to-b from-sky-950/20 to-slate-900/60',
      text: 'text-sky-400',
      glow: 'shadow-[0_0_12px_rgba(14,165,233,0.15)]',
    },
  }[variant];

  return (
    <div
      className={`relative rounded-2xl p-2.5 sm:p-3 text-center border backdrop-blur-xl transition-all duration-300 ${variantStyles.border} ${variantStyles.bg} ${variantStyles.glow}`}
    >
      <div className="flex items-center justify-center mb-1 text-slate-300">
        {icon}
      </div>
      <span className={`text-base sm:text-lg font-black font-mono block leading-none ${variantStyles.text}`}>
        {value}
      </span>
      <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">
        {label}
      </span>
    </div>
  );
};
