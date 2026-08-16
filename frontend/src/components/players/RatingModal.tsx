import React, { useState, useEffect } from 'react';
import { Player, AddRatingInput } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { Award, CheckCircle2, Lock, Zap, Activity, AlertCircle, Sparkles } from 'lucide-react';
import { getRankInfo } from '../../constants/ranks';

interface RatingModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (playerId: string, rating: AddRatingInput) => Promise<void>;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  player,
  isOpen,
  onClose,
  onSubmitRating,
}) => {
  // Inicialmente 0 em ambos para indicar "Sem Voto / Não Votar (∅)"
  const [skillRating, setSkillRating] = useState<number>(0.0);
  const [physicalRating, setPhysicalRating] = useState<number>(0.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSkillRating(0.0);
      setPhysicalRating(0.0);
      setSuccessMsg(null);
    }
  }, [isOpen, player?.id]);

  if (!player) return null;

  const rankInfo = getRankInfo(player.overallRating);
  const quickRatings = [0.0, 5.0, 10.0];

  const skillCount = player.skillRatingCount ?? 0;
  const physicalCount = player.physicalRatingCount ?? 0;
  const maxAllowed = player.maxRatingsAllowed || 1;

  const isSkillMaxReached = skillCount >= maxAllowed;
  const isPhysicalMaxReached = physicalCount >= maxAllowed;
  const areBothMaxReached = isSkillMaxReached && isPhysicalMaxReached;

  const hasAnyVote = (skillRating > 0 && !isSkillMaxReached) || (physicalRating > 0 && !isPhysicalMaxReached);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyVote || areBothMaxReached) return;

    try {
      setIsSubmitting(true);
      const effectiveSkill = isSkillMaxReached ? 0 : skillRating;
      const effectivePhysical = isPhysicalMaxReached ? 0 : physicalRating;

      await onSubmitRating(player.id, {
        skill: effectiveSkill,
        physical: effectivePhysical,
      });

      let summary = '';
      if (effectiveSkill > 0 && effectivePhysical > 0) {
        summary = `Skill (${Math.round(effectiveSkill * 10)}) e Físico (${Math.round(effectivePhysical * 10)})`;
      } else if (effectiveSkill > 0) {
        summary = `Skill (${Math.round(effectiveSkill * 10)})`;
      } else {
        summary = `Físico (${Math.round(effectivePhysical * 10)})`;
      }

      setSuccessMsg(`Sua avaliação de ${summary} para ${player.name} foi salva com sucesso!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1400);
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Avaliar ${player.name}`}
      maxWidth="md"
    >
      {successMsg ? (
        <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-90 duration-200">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Avaliação Registrada!</h4>
          <p className="text-xs text-slate-300">{successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================= ATLETA EM DESTAQUE ================= */}
          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <PlayerAvatar
                name={player.name}
                photoUrl={player.photoUrl}
                size="md"
                isGoalkeeper={player.position === 'GOALKEEPER'}
              />
              <div>
                <h4 className="font-bold text-white text-sm">{player.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase shadow-sm"
                    style={{
                      backgroundColor: `${rankInfo.colorHex}25`,
                      color: rankInfo.colorHex,
                      border: `1px solid ${rankInfo.colorHex}55`,
                    }}
                  >
                    RANK {player.overallRating > 0 ? rankInfo.rank : 'NOVO'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {player.position === 'GOALKEEPER' ? '🧤 Goleiro' : '🏃 Linha'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contadores Separados de Votos no Ciclo */}
            <div className="flex flex-col items-end gap-1 text-[10px] font-mono">
              <span
                className={`px-2 py-0.5 rounded-md border ${
                  isSkillMaxReached
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}
                title="Votos de Skill no ciclo"
              >
                ⚡ Skill: {skillCount}/{maxAllowed}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md border ${
                  isPhysicalMaxReached
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                }`}
                title="Votos de Físico no ciclo"
              >
                🏃 Físico: {physicalCount}/{maxAllowed}
              </span>
            </div>
          </div>

          {/* Aviso se AMBOS os limites foram atingidos */}
          {areBothMaxReached ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <strong className="block font-bold">Limite de avaliações completo!</strong>
                <span>
                  Este atleta já recebeu o número máximo de votos de Skill e Físico deste ciclo ({maxAllowed}). Aguarde a virada do mês para novas avaliações.
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* ================= 1. SEÇÃO DE HABILIDADE (SKILL - 60%) ================= */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                isSkillMaxReached
                  ? 'bg-slate-950/50 border-slate-800 opacity-60'
                  : skillRating > 0
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-slate-900/50 border-slate-800/80'
              }`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Zap className={`w-4 h-4 ${skillRating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider block leading-tight">
                        Habilidade Técnica
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold block leading-tight mt-0.5">
                        60% do peso no equilíbrio
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSkillMaxReached ? (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        Limite Atingido
                      </span>
                    ) : (
                      <span className={`text-xl font-black font-mono tracking-tight px-3 py-1 rounded-xl border flex items-center justify-center min-w-[50px] ${
                        skillRating > 0
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                      }`}>
                        {skillRating > 0 ? Math.round(skillRating * 10) : '∅'}
                      </span>
                    )}
                  </div>
                </div>

                {!isSkillMaxReached && (
                  <div className="space-y-2.5 pt-1">
                    {/* Slider de Skill (0 = Sem voto, 10 a 100) */}
                    <div>
                      <input
                        type="range"
                        min="0.0"
                        max="10.0"
                        step="0.5"
                        value={skillRating}
                        onChange={(e) => setSkillRating(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                        <span className={skillRating === 0 ? 'text-amber-400 font-bold' : ''}>0 (∅)</span>
                        <span>50 (Médio)</span>
                        <span>100 (Lendário)</span>
                      </div>
                    </div>

                    {/* Botões Rápidos de Skill: [0, 50, 100] */}
                    <div className="grid grid-cols-3 gap-2">
                      {quickRatings.map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setSkillRating(val)}
                          className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            skillRating === val
                              ? val === 0
                                ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-500'
                                : 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {val === 0 ? '0' : Math.round(val * 10)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= 2. SEÇÃO DE CONDICIONAMENTO FÍSICO (40%) ================= */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                isPhysicalMaxReached
                  ? 'bg-slate-950/50 border-slate-800 opacity-60'
                  : physicalRating > 0
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-900/50 border-slate-800/80'
              }`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Activity className={`w-4 h-4 ${physicalRating > 0 ? 'text-cyan-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider block leading-tight">
                        Condicionamento Físico
                      </span>
                      <span className="text-[10px] text-cyan-400 font-semibold block leading-tight mt-0.5">
                        40% do peso no equilíbrio
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPhysicalMaxReached ? (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        Limite Atingido
                      </span>
                    ) : (
                      <span className={`text-xl font-black font-mono tracking-tight px-3 py-1 rounded-xl border flex items-center justify-center min-w-[50px] ${
                        physicalRating > 0
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                      }`}>
                        {physicalRating > 0 ? Math.round(physicalRating * 10) : '∅'}
                      </span>
                    )}
                  </div>
                </div>

                {!isPhysicalMaxReached && (
                  <div className="space-y-2.5 pt-1">
                    {/* Slider de Físico (0 = Sem voto, 10 a 100) */}
                    <div>
                      <input
                        type="range"
                        min="0.0"
                        max="10.0"
                        step="0.5"
                        value={physicalRating}
                        onChange={(e) => setPhysicalRating(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                        <span className={physicalRating === 0 ? 'text-cyan-400 font-bold' : ''}>0 (∅)</span>
                        <span>50 (Médio)</span>
                        <span>100 (Gás Infinito)</span>
                      </div>
                    </div>

                    {/* Botões Rápidos de Físico: [0, 50, 100] */}
                    <div className="grid grid-cols-3 gap-2">
                      {quickRatings.map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setPhysicalRating(val)}
                          className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            physicalRating === val
                              ? val === 0
                                ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-500'
                                : 'bg-cyan-400 text-slate-950 shadow-md font-black scale-105'
                              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {val === 0 ? '0' : Math.round(val * 10)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= BANNER DINÂMICO DE CONFIRMAÇÃO (ALTURA ESTÁVEL DE 2 LINHAS) ================= */}
              <div className="min-h-[54px] p-3 rounded-xl border text-xs flex items-center bg-slate-900/60 border-slate-800">
                {!hasAnyVote ? (
                  <div className="text-slate-400 flex items-center gap-2 w-full">
                    <span className="text-amber-400 text-sm shrink-0">ℹ️</span>
                    <span className="leading-snug">
                      Ambos estão em <strong>0</strong>. Escolha uma nota para <strong>Skill</strong>, <strong>Físico</strong> ou <strong>ambos</strong> para votar.
                    </span>
                  </div>
                ) : skillRating > 0 && physicalRating > 0 ? (
                  <div className="text-emerald-300 flex items-center gap-2 font-medium w-full">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="leading-snug">
                      Gravando ambos: <strong className="text-amber-300">Skill {Math.round(skillRating * 10)}</strong> + <strong className="text-cyan-300">Físico {Math.round(physicalRating * 10)}</strong>.
                    </span>
                  </div>
                ) : skillRating > 0 ? (
                  <div className="text-amber-300 flex items-center gap-2 font-medium w-full">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="leading-snug">
                      Gravando apenas <strong className="text-white">Skill {Math.round(skillRating * 10)}</strong> (Físico: ∅ - Não avaliado).
                    </span>
                  </div>
                ) : (
                  <div className="text-cyan-300 flex items-center gap-2 font-medium w-full">
                    <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="leading-snug">
                      Gravando apenas <strong className="text-white">Físico {Math.round(physicalRating * 10)}</strong> (Skill: ∅ - Não avaliado).
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Votos 100% anônimos e confidenciais.</span>
              </div>
            </>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              {areBothMaxReached ? 'Fechar' : 'Cancelar'}
            </Button>
            {!areBothMaxReached && (
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={!hasAnyVote}
                isLoading={isSubmitting}
                leftIcon={<Award className="w-4 h-4" />}
              >
                Confirmar Voto
              </Button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};
