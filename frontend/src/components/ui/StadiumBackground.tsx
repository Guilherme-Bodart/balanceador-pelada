import React from 'react';

export const StadiumBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      {/* Luzes de Refletores de Estádio e Gradientes Radiais Ambientais */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[100px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[450px] h-[450px] bg-purple-600/5 blur-[120px] rounded-full" />
        {/* Grade sutil de fundo estilo tático */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
