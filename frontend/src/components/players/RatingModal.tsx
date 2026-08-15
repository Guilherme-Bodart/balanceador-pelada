import React, { useState } from 'react';
import { Player } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { Award, CheckCircle2, Lock, Zap, AlertCircle } from 'lucide-react';
import { getRankInfo } from '../../constants/ranks';

interface RatingModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (playerId: string, rating: number) => Promise<void>;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  player,
  isOpen,
  onClose,
  onSubmitRating,
}) => {
  const [rating, setRating] = useState<number>(7.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!player) return null;

  const rankInfo = getRankInfo(player.overallRating);
  const quickRatings = [5.0, 6.0, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];
  const isMaxReached = player.ratingCount >= player.maxRatingsAllowed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxReached) return;

    try {
      setIsSubmitting(true);
      await onSubmitRating(player.id, rating);
      setSuccessMsg(`Sua avaliação de Skill (${rating.toFixed(1)}) foi salva com sucesso!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
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
      title="Avaliar Habilidade (Skill)"
      subtitle="Sua avaliação é 100% confidencial e compõe o Rank do atleta no mês."
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
          {/* Atleta Sendo Avaliado */}
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
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black border ${rankInfo.badgeBg} ${rankInfo.badgeText} ${rankInfo.badgeBorder}`}
                  >
                    RANK {rankInfo.rank}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {player.position === 'GOALKEEPER' ? '🧤 Goleiro' : '🏃 Linha'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contador de Votos do Mês */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Votos no Ciclo</span>
              <span
                className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg border ${
                  isMaxReached
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {player.ratingCount} / {player.maxRatingsAllowed}
              </span>
            </div>
          </div>

          {/* Aviso se o limite de votos do elenco foi atingido */}
          {isMaxReached ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <strong className="block font-bold">Limite de avaliações atingido!</strong>
                <span>
                  Este atleta já recebeu o número máximo de votos deste ciclo ({player.maxRatingsAllowed}). Aguarde a virada do mês para novas avaliações.
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Seletor Visual de Nota de Skill */}
              <div className="text-center py-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Nota Técnica / Skill (75% peso no equilíbrio)
                </span>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
                    {rating.toFixed(1)}
                  </span>
                </div>

                {/* Slider de Precisão */}
                <div className="px-6 mt-4">
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.5"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>1.0 (Iniciante)</span>
                    <span>5.0 (Médio)</span>
                    <span>10.0 (Lendário)</span>
                  </div>
                </div>

                <div className="mt-3 mx-4 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Voto 100% anônimo.</span>
                </div>
              </div>

              {/* Botões de Notas Rápidas */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">
                  Atalhos Rápidos:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {quickRatings.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRating(val)}
                      className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        rating === val
                          ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {val.toFixed(1)}
                    </button>
                  ))}
                </div>
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
              {isMaxReached ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isMaxReached && (
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
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
