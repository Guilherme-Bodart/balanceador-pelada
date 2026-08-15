import React, { useState } from 'react';
import { DrawResponse } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check, Send } from 'lucide-react';
import { getRankInfo } from '../../constants/ranks';

interface ShareModalProps {
  result: DrawResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const { teamA, teamB, reserves, differenceScore, advantageTeam, isEquilibrado } = result;

  const generateShareText = () => {
    let text = `⚽ *TIMES SORTEADOS - PELADA PRO* ⚽\n`;
    text += `⚖️ *Status:* ${isEquilibrado ? 'Times Equilibrados' : 'Equilíbrio Ajustado'}\n`;
    if (advantageTeam) {
      text += `📊 *Balanço:* ${advantageTeam}\n\n`;
    } else {
      text += `📊 *Diferença estimada:* ${differenceScore.toFixed(1)} pts\n\n`;
    }

    // Time 1
    text += `🟢 *${teamA.name.toUpperCase()}* (${teamA.totalPlayers} atletas)\n`;
    if (teamA.goalkeeper) {
      const r = getRankInfo(teamA.goalkeeper.overallRating);
      text += `🧤 Goleiro: ${teamA.goalkeeper.name} [Rank ${r.rank}]\n`;
    }
    text += `🏃 Linha:\n`;
    teamA.fieldPlayers.forEach((p, idx) => {
      const r = getRankInfo(p.overallRating);
      text += `  ${idx + 1}. ${p.name} [Rank ${r.rank}]\n`;
    });

    text += `\n------------------------\n\n`;

    // Time 2
    text += `🔵 *${teamB.name.toUpperCase()}* (${teamB.totalPlayers} atletas)\n`;
    if (teamB.goalkeeper) {
      const r = getRankInfo(teamB.goalkeeper.overallRating);
      text += `🧤 Goleiro: ${teamB.goalkeeper.name} [Rank ${r.rank}]\n`;
    }
    text += `🏃 Linha:\n`;
    teamB.fieldPlayers.forEach((p, idx) => {
      const r = getRankInfo(p.overallRating);
      text += `  ${idx + 1}. ${p.name} [Rank ${r.rank}]\n`;
    });

    // Reservas (se houver)
    if (reserves.length > 0) {
      text += `\n------------------------\n`;
      text += `🔄 *PRÓXIMOS / RESERVAS:*\n`;
      reserves.forEach((p, idx) => {
        const r = getRankInfo(p.overallRating);
        text += `  ${idx + 1}. ${p.name} [Rank ${r.rank}]\n`;
      });
    }

    text += `\n🏆 *Sorteador de Times Pro* - Boa pelada a todos! ⚽🔥`;
    return text;
  };

  const shareText = generateShareText();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compartilhar Escalação"
      subtitle="Envie os times com Ranks no grupo da pelada"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Caixa de Texto Formatada */}
        <div className="relative">
          <textarea
            readOnly
            value={shareText}
            rows={12}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3.5 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none select-all"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copiado!' : 'Copiar Texto'}
          </Button>

          <Button
            type="button"
            variant="glow"
            className="flex-1"
            onClick={handleWhatsApp}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Abrir WhatsApp
          </Button>
        </div>
      </div>
    </Modal>
  );
};
