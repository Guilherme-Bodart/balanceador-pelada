import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface MonthlyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => Promise<void>;
  totalPlayers: number;
}

export const MonthlyResetModal: React.FC<MonthlyResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  totalPlayers,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirmReset();
      setSuccessResult('Virada de ciclo realizada com sucesso!');
      setTimeout(() => {
        setSuccessResult(null);
        onClose();
      }, 1500);
    } catch (error: any) {
      alert(error.message || 'Erro ao realizar virada de mês.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Virada de Mês / Fechamento de Ciclo"
      subtitle="Consolide as médias das partidas e inicie um novo ciclo de avaliações."
      maxWidth="md"
    >
      {successResult ? (
        <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-90 duration-200">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Mês Virado com Sucesso!</h4>
          <p className="text-xs text-slate-300">{successResult}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs text-slate-200">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Como funciona a Virada de Mês?</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-300">
              <li>
                A <strong>média calculada de cada jogador neste mês</strong> se tornará a nova nota inicial de Skill do mês seguinte.
              </li>
              <li>
                Os votos individuais são zerados, liberando espaço para até <strong>{totalPlayers} novos votos</strong> por jogador no novo mês.
              </li>
              <li>
                O Rank e o equilíbrio continuam evoluindo mês a mês sem perder o histórico do atleta!
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="glow"
              className="flex-1"
              isLoading={isSubmitting}
              onClick={handleConfirm}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              rightIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Confirmar Virada
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
