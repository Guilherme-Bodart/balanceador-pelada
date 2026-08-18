import React, { CSSProperties } from "react";
import { normalizePokemonPhotoUrl } from "../../services/pokemonService";

export type ShieldEffect = "none" | "glow" | "beam" | "shine" | "all";

export type PlayerShieldProps = {
  /** Nome exibido em destaque */
  name: string;
  /** Posição, ex: "GOLEIRO" */
  position: string;
  /** Nota geral, ex: 7.9 */
  rating: number;
  /** Classificação, ex: "A+" */
  grade?: string;
  /** URL da foto do jogador */
  photoUrl?: string;
  /** Estatísticas exibidas na base do escudo */
  stats?: { label: string; value: string | number }[];
  /** Cor de destaque da borda (qualquer cor CSS, ex: "#f59e0b", "rgb(...)", etc.) */
  accent?: string;
  /** Cor secundária do degradê da borda */
  accentAlt?: string;
  /** Espessura da borda principal (padrão: 5) */
  borderWidth?: number;
  /** Ativar brilho / neon externo na cor da borda */
  glow?: boolean;
  /** Ativar feixe de luz animado (beam orbital) */
  beam?: boolean;
  /** Ativar reflexo de luz brilhante (gloss) */
  shine?: boolean;
  /** Modo de efeito rápido: "none" | "glow" | "beam" | "shine" | "all" */
  effect?: ShieldEffect;
  /** Etiqueta no topo, ex: "CONVOCADO" ou "LENDÁRIO" */
  badge?: string;
  className?: string;
};

/**
 * Escudo de jogador no estilo FIFA Classic com bordas e efeitos 100% customizáveis.
 */
export function PlayerShield({
  name,
  position,
  rating,
  grade,
  photoUrl,
  stats = [],
  accent = "#f59e0b",
  accentAlt,
  borderWidth = 5,
  glow = true,
  shine = true,
  effect = "glow",
  badge,
  className = "",
}: PlayerShieldProps) {
  const finalAccentAlt = accentAlt ?? accent;
  const isUR = grade === "UR" || accent === "#ffffff" || accent.toLowerCase() === "#fff";
  const normalizedPhotoUrl = normalizePokemonPhotoUrl(photoUrl) || undefined;

  // Resolução de efeitos
  const hasGlow = glow || effect === "glow" || effect === "all";
  const hasShine =
    shine && effect !== "none"
      ? shine
      : effect === "shine" || effect === "all" || shine;

  const style = {
    "--shield-accent": accent,
    "--shield-accent-alt": finalAccentAlt,
    "--shield-glow": hasGlow
      ? isUR
        ? `0 0 25px rgba(255,255,255,0.85), 0 0 45px rgba(192,132,252,0.65), 0 0 65px rgba(232,121,249,0.35)`
        : `0 0 25px ${accent}88, 0 0 50px ${accent}44`
      : "none",
  } as CSSProperties;

  // ID único para evitar conflito de gradientes SVG entre múltiplos escudos
  const uniqueId = React.useId().replace(/:/g, "");

  return (
    <div
      style={style}
      className={`relative aspect-[3/4] select-none transform-gpu will-change-transform ${
        className || "w-64"
      }`}
    >
      {/* Glow externo neon opcional */}
      {hasGlow && (
        <div
          className="absolute inset-0 rounded-[35px] opacity-75 blur-xl pointer-events-none transition-opacity duration-300"
          style={{
            background: isUR
              ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(192,132,252,0.4) 40%, rgba(168,85,247,0.2) 70%, transparent 100%)`
              : `radial-gradient(circle at 50% 50%, ${accent}66 0%, ${finalAccentAlt}22 70%, transparent 100%)`,
          }}
        />
      )}

      {/* SVG de fundo do escudo FIFA Classic */}
      <svg
        viewBox="0 0 300 400"
        className="absolute inset-0 h-full w-full drop-shadow-[0_18px_35px_rgba(0,0,0,0.65)]"
        style={{
          filter: hasGlow ? (isUR ? `drop-shadow(0 0 18px rgba(192,132,252,0.8))` : `drop-shadow(0 0 16px ${accent}aa)`) : undefined,
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`shield-body-${uniqueId}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={isUR ? "#1c142e" : "#161a24"} />
            <stop offset="55%" stopColor={isUR ? "#100c1e" : "#0d1017"} />
            <stop offset="100%" stopColor="#05070b" />
          </linearGradient>

          {/* Degradê da Borda Customizável */}
          <linearGradient
            id={`shield-edge-${uniqueId}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={isUR ? "#ffffff" : "var(--shield-accent)"} />
            <stop offset="100%" stopColor={isUR ? "#c084fc" : "var(--shield-accent-alt)"} />
          </linearGradient>

          {/* Efeito Gloss Reflexivo */}
          <linearGradient
            id={`shield-gloss-${uniqueId}`}
            x1="0"
            y1="0"
            x2="0.7"
            y2="1"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isUR ? "0.35" : "0.22"} />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Corpo escuro do escudo */}
        <path
          d="M150 6 L288 46 C288 46 290 250 240 320 C210 362 176 384 150 394 C124 384 90 362 60 320 C10 250 12 46 12 46 Z"
          fill={`url(#shield-body-${uniqueId})`}
          stroke={`url(#shield-edge-${uniqueId})`}
          strokeWidth={borderWidth}
          strokeLinejoin="round"
        />

        {/* 2. Borda interna decorativa fina */}
        <path
          d="M150 20 L276 56 C276 56 277 245 232 309 C205 347 174 367 150 376 C126 367 95 347 68 309 C23 245 24 56 24 56 Z"
          fill="none"
          stroke={`url(#shield-edge-${uniqueId})`}
          strokeOpacity={isUR ? "0.6" : "0.4"}
          strokeWidth="1.5"
        />

        {/* 3. Camada de brilho / gloss opcional */}
        {hasShine && (
          <path
            d="M150 6 L288 46 C288 46 289 140 276 210 L24 210 C11 140 12 46 12 46 Z"
            fill={`url(#shield-gloss-${uniqueId})`}
          />
        )}

        {/* Linha horizontal divisória */}
        <line
          x1="52"
          y1="252"
          x2="248"
          y2="252"
          stroke={`url(#shield-edge-${uniqueId})`}
          strokeOpacity={isUR ? "0.7" : "0.5"}
          strokeWidth="1.5"
        />
      </svg>

      {/* Nota + classificação */}
      <div className="absolute left-[13%] top-[15%] z-10 flex flex-col items-center leading-none">
        <span
          className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-white drop-shadow-md ${
            isUR
              ? "text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-100 to-purple-300 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]"
              : ""
          }`}
        >
          {rating > 0 ? (rating <= 10 ? Math.round(rating * 10) : Math.round(rating)) : "—"}
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          {position.slice(0, 3)}
        </span>
        {grade ? (
          <span
            className={`mt-1.5 rounded-md px-1.5 py-[2px] text-[11px] font-black shadow-md ${
              isUR
                ? "bg-gradient-to-r from-white via-purple-100 to-purple-300 text-purple-950 border border-white shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_20px_rgba(192,132,252,0.6)]"
                : "text-black"
            }`}
            style={{ backgroundColor: isUR ? undefined : "var(--shield-accent)" }}
          >
            {grade}
          </span>
        ) : null}
      </div>

      {/* Foto */}
      <div className="absolute right-[6%] top-[13%] z-10 h-[38%] w-[52%] overflow-hidden">
        {normalizedPhotoUrl ? (
          <img
            src={normalizedPhotoUrl}
            alt={name}
            className="h-full w-full object-contain object-bottom drop-shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-end justify-center">
            <div
              className="h-[70%] w-[60%] rounded-t-full opacity-40"
              style={{ backgroundColor: "var(--shield-accent)" }}
            />
          </div>
        )}
      </div>

      {/* Etiqueta superior opcional */}
      {badge ? (
        <span
          className={`absolute left-1/2 top-[4%] z-20 -translate-x-1/2 rounded-full px-3 py-[3px] text-[9px] font-black uppercase tracking-[0.18em] shadow-md pointer-events-none border ${
            isUR
              ? "bg-white text-purple-950 border-purple-200 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              : "text-black border-transparent"
          }`}
          style={{ backgroundColor: isUR ? undefined : "var(--shield-accent)" }}
        >
          {badge}
        </span>
      ) : null}

      {/* Nome */}
      <div className="absolute inset-x-0 top-[56%] z-10 text-center">
        <h3 className="truncate px-8 text-lg font-black uppercase tracking-wide text-white drop-shadow-md">
          {name}
        </h3>
      </div>

      {/* Estatísticas */}
      {stats.length > 0 ? (
        <div className="absolute inset-x-0 top-[68%] z-10 flex flex-col items-center mt-2 space-y-1">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 border-b border-white/10 pb-[2px]"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                {s.label}
              </span>
              <span className="text-xs font-bold tabular-nums text-white">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default PlayerShield;
