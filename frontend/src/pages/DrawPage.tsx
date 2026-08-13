import React, { useState, useEffect } from 'react';
import { Player, DrawResponse } from '../types';
import { DrawConfig } from '../components/draw/DrawConfig';
import { PlayerCard } from '../components/players/PlayerCard';
import { TeamDisplay } from '../components/draw/TeamDisplay';
import { ShareModal } from '../components/draw/ShareModal';
import { drawService } from '../services/drawService';
import confetti from 'canvas-confetti';
import { Search, UserCheck } from 'lucide-react';

interface DrawPageProps {
  players: Player[];
  selectedPlayerIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const DrawPage: React.FC<DrawPageProps> = ({
  players,
  selectedPlayerIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
}) => {
  const [playersPerTeam, setPlayersPerTeam] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<DrawResponse | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Controle dinâmico de quem é Goleiro nesta partida
  const [customGkIds, setCustomGkIds] = useState<string[]>([]);

  // Sincroniza goleiros padrão quando a lista de jogadores carrega
  useEffect(() => {
    if (players.length > 0) {
      setCustomGkIds((prev) => {
        if (prev.length === 0) {
          return players.filter((p) => p.position === 'GOALKEEPER').map((p) => p.id);
        }
        return prev;
      });
    }
  }, [players]);

  // Alterna o status de goleiro para um jogador nesta partida
  const handleToggleGoalkeeper = (playerId: string) => {
    setCustomGkIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Contagem de goleiros entre os selecionados para hoje
  const selectedGoalkeepersCount = selectedPlayerIds.filter((id) =>
    customGkIds.includes(id)
  ).length;

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const isAllSelected = players.length > 0 && selectedPlayerIds.length === players.length;

  const handleExecuteDraw = async () => {
    try {
      setIsDrawing(true);
      const activeGkIds = customGkIds.filter((id) => selectedPlayerIds.includes(id));
      
      const result = await drawService.drawTeams({
        playerIds: selectedPlayerIds,
        playersPerTeam,
        goalkeeperIds: activeGkIds,
      });

      setDrawResult(result);

      // Dispara confetes comemorativos
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#84CC16', '#F59E0B', '#38BDF8'],
      });
    } catch (error: any) {
      alert(error.message || 'Erro ao realizar o sorteio.');
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg sm:max-w-xl mx-auto px-3 sm:px-4 pb-2">
      {/* Se já houve sorteio, exibe os resultados em 2 colunas com o X */}
      {drawResult ? (
        <div className="space-y-4">
          <TeamDisplay
            result={drawResult}
            onOpenShare={() => setIsShareModalOpen(true)}
            onRedraw={handleExecuteDraw}
          />
        </div>
      ) : (
        /* Se ainda não sorteou, exibe a interface de configuração e seleção em 2 colunas */
        <div className="space-y-4">
          {/* Painel de Configuração do Sorteio */}
          <DrawConfig
            playersPerTeam={playersPerTeam}
            onPlayersPerTeamChange={setPlayersPerTeam}
            totalSelected={selectedPlayerIds.length}
            totalGoalkeepers={selectedGoalkeepersCount}
            onDraw={handleExecuteDraw}
            isLoading={isDrawing}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
            isAllSelected={isAllSelected}
          />

          {/* Cabeçalho da Lista de Presença */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-white text-sm tracking-tight">
                Quem vai jogar hoje?
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {selectedPlayerIds.length} de {players.length} marcados
            </span>
          </div>

          {/* Busca rápida na lista de seleção */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar Pokémon / atleta..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Lista de Seleção em 2 COLUNAS LADO A LADO */}
          <div className="grid grid-cols-2 gap-2">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id);
              const isGk = customGkIds.includes(player.id);
              return (
                <PlayerCard
                  key={player.id}
                  player={player}
                  selectable={true}
                  isSelected={isSelected}
                  onToggleSelect={onToggleSelect}
                  isCustomGoalkeeper={isGk}
                  onToggleGoalkeeper={handleToggleGoalkeeper}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento no WhatsApp */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={drawResult}
      />
    </div>
  );
};
