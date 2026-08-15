import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Player } from '../../types';
import { getRankInfo } from '../../constants/ranks';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  player: Player | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  player,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!player) return null;

  const rankInfo = getRankInfo(player.overallRating);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Jogador" maxWidth="sm">
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white text-sm">Confirmar Exclusão</p>
            <p className="text-slate-300 mt-0.5">
              Esta ação removerá o atleta e seu histórico permanentemente.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-sm">
                {player.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-black text-white text-sm uppercase">{player.name}</h4>
              <span className="text-xs text-slate-400">
                {player.position === 'GOALKEEPER' ? '🧤 Goleiro' : '🏃 Linha'}
              </span>
            </div>
          </div>

          <div
            className={`px-2.5 py-1 rounded-md text-xs font-black ${rankInfo.badgeBg} ${rankInfo.badgeText}`}
          >
            {rankInfo.rank}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Excluir Atleta
          </Button>
        </div>
      </div>
    </Modal>
  );
};
