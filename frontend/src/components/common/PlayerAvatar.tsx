import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface PlayerAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isGoalkeeper?: boolean;
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  photoUrl,
  size = 'md',
  isGoalkeeper = false,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] rounded-md text-[10px]',
    sm: 'w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-xl text-xs',
    md: 'w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-2xl text-sm font-black',
    lg: 'w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl text-base font-black',
  };

  const getInitials = (str: string) => {
    if (!str) return '??';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const showImage = !!photoUrl && !hasError;

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses[size]} aspect-square overflow-hidden bg-slate-800 border border-slate-700/80 flex items-center justify-center shadow-inner`}
      >
        {showImage ? (
          <img
            src={photoUrl}
            alt={name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center aspect-square block"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-slate-200 font-bold tracking-tight">
            {getInitials(name)}
          </div>
        )}
      </div>

      {isGoalkeeper && size !== 'xs' && (
        <div
          title="Goleiro Fixo"
          className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 sm:p-1 rounded-full shadow-md border-2 border-slate-900 flex items-center justify-center"
        >
          <ShieldAlert className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
        </div>
      )}
    </div>
  );
};
