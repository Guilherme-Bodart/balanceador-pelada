import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DrawResponse } from '../../types';
import { Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawData: DrawResponse | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  drawData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!drawData) return null;

  const generateShareText = (): string => {
    const { teamA, teamB, differenceScore, isEquilibrado } = drawData;

    let text = `⚽ *SORTEIO DE TIMES - PELADA PRO* ⚽\n`;
    text += `⚖️ Status: ${isEquilibrado ? '✅ Equilibrado' : '⚠️ Vantagem Leve'} (Dif: ${differenceScore.toFixed(1)})\n\n`;

    text += `🔴 *TIME VERMELHO* (${teamA.fieldPlayers.length + (teamA.goalkeeper ? 1 : 0)} jogadores):\n`;
    if (teamA.goalkeeper) {
      text += `🧤 Goleiro: ${teamA.goalkeeper.name} (★ ${teamA.goalkeeper.overallRating.toFixed(1)})\n`;
    }
    teamA.fieldPlayers.forEach((p, idx) => {
      text += `${idx + 1}. ${p.name} (★ ${p.overallRating.toFixed(1)})\n`;
    });

    text += `\n🔵 *TIME AZUL* (${teamB.fieldPlayers.length + (teamB.goalkeeper ? 1 : 0)} jogadores):\n`;
    if (teamB.goalkeeper) {
      text += `🧤 Goleiro: ${teamB.goalkeeper.name} (★ ${teamB.goalkeeper.overallRating.toFixed(1)})\n`;
    }
    teamB.fieldPlayers.forEach((p, idx) => {
      text += `${idx + 1}. ${p.name} (★ ${p.overallRating.toFixed(1)})\n`;
    });

    text += `\nGerado pelo *Sorteador PRO Pelada* 🚀`;
    return text;
  };

  const shareText = generateShareText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('Erro ao copiar para a área de transferência.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartilhar Escalação" maxWidth="md">
      <div className="space-y-4 pt-1">
        <p className="text-xs text-slate-300">
          Copie a escalação formatada abaixo e envie direto no grupo do WhatsApp da pelada:
        </p>

        {/* Pré-visualização do Texto Formatado */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-64 overflow-y-auto selection:bg-emerald-500 selection:text-slate-950">
          {shareText}
        </div>

        {/* Botão de Copiar */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
          >
            Fechar
          </Button>

          <Button
            type="button"
            variant="glow"
            size="md"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copiado para o WhatsApp!' : 'Copiar Escalação'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
