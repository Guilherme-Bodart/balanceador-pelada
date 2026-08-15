import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RefreshCw, CheckCircle2, AlertTriangle, Sparkles, Lock, KeyRound } from 'lucide-react';

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
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg(null);
      setSuccessResult(null);
    }
  }, [isOpen]);

  const handleConfirm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (password.trim() !== '7337') {
      setErrorMsg('Senha incorreta! Digite a senha master autorizada.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmReset();
      setSuccessResult('Virada de ciclo realizada com sucesso!');
      setTimeout(() => {
        setSuccessResult(null);
        onClose();
      }, 1500);
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro ao realizar virada de mês.');
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
        <form onSubmit={handleConfirm} className="space-y-4">
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

          {/* Campo de Senha de Segurança */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Senha de Confirmação Master</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Digite a senha master de autorização..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono tracking-widest"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium flex items-center gap-1 pt-1">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </p>
            )}
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
              type="submit"
              variant="glow"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={!password}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              rightIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Confirmar Virada
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
