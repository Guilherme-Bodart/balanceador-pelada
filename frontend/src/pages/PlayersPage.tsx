import React, { useState } from 'react';
import { Player, CreatePlayerInput, UpdatePlayerInput } from '../types';
import { PlayerCard } from '../components/players/PlayerCard';
import { PlayerFormModal } from '../components/players/PlayerFormModal';
import { RatingModal } from '../components/players/RatingModal';
import { MonthlyResetModal } from '../components/players/MonthlyResetModal';
import { Button } from '../components/common/Button';
import { UserPlus, Search, ShieldAlert, Users, Calendar } from 'lucide-react';

interface PlayersPageProps {
  players: Player[];
  onRefresh: () => Promise<void>;
  onSavePlayer: (data: CreatePlayerInput | UpdatePlayerInput, id?: string) => Promise<void>;
  onDeletePlayer: (id: string) => Promise<void>;
  onRatePlayer: (id: string, rating: number) => Promise<void>;
  onMonthlyReset: () => Promise<void>;
  isLoading: boolean;
}

export const PlayersPage: React.FC<PlayersPageProps> = ({
  players,
  onSavePlayer,
  onDeletePlayer,
  onRatePlayer,
  onMonthlyReset,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<'ALL' | 'FIELD' | 'GOALKEEPER'>('ALL');
  
  // Modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [ratingPlayer, setRatingPlayer] = useState<Player | null>(null);

  // Filtros
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos =
      filterPosition === 'ALL' ||
      (filterPosition === 'GOALKEEPER' && p.position === 'GOALKEEPER') ||
      (filterPosition === 'FIELD' && p.position !== 'GOALKEEPER');
    return matchesSearch && matchesPos;
  });

  // Estatísticas Rápidas
  const totalGk = players.filter((p) => p.position === 'GOALKEEPER').length;
  const totalField = players.length - totalGk;

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingPlayer(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (player: Player) => {
    if (window.confirm(`Tem certeza que deseja excluir o jogador "${player.name}"?`)) {
      try {
        await onDeletePlayer(player.id);
      } catch (error: any) {
        alert(error.message || 'Erro ao excluir jogador.');
      }
    }
  };

  return (
    <div className="space-y-4 max-w-lg sm:max-w-xl mx-auto px-3 sm:px-4 pb-4">
      {/* Resumo / Banner de Estatísticas + Virada de Mês */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card rounded-2xl p-2.5 sm:p-3 text-center border border-slate-800">
          <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <span className="text-base sm:text-lg font-black font-mono text-white block">
            {players.length}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Total Elenco
          </span>
        </div>

        <div className="glass-card rounded-2xl p-2.5 sm:p-3 text-center border border-slate-800">
          <ShieldAlert className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <span className="text-base sm:text-lg font-black font-mono text-amber-400 block">
            {totalGk}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Goleiros
          </span>
        </div>

        <div className="glass-card rounded-2xl p-2.5 sm:p-3 text-center border border-slate-800">
          <Users className="w-4 h-4 text-sky-400 mx-auto mb-1" />
          <span className="text-base sm:text-lg font-black font-mono text-sky-400 block">
            {totalField}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Linha
          </span>
        </div>
      </div>

      {/* Botão de Virada de Mês (Consolidação de Médias) */}
      <button
        type="button"
        onClick={() => setIsResetModalOpen(true)}
        className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 hover:border-purple-400 flex items-center justify-between text-xs transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-bold text-white block">Virada de Mês (Reset de Ciclo)</span>
            <span className="text-[10px] text-slate-400">Consolida as médias e abre novo ciclo</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform">
          Virar Mês →
        </span>
      </button>

      {/* Barra de Ação: Busca e Botão Novo Jogador */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <Button
          type="button"
          variant="glow"
          size="md"
          onClick={handleNew}
          className="shrink-0 rounded-2xl"
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Novo
        </Button>
      </div>

      {/* Filtros de Posição (Chips) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterPosition('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterPosition === 'ALL'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
              : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Todos ({players.length})
        </button>
        <button
          onClick={() => setFilterPosition('FIELD')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterPosition === 'FIELD'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
              : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🏃 Linha ({totalField})
        </button>
        <button
          onClick={() => setFilterPosition('GOALKEEPER')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterPosition === 'GOALKEEPER'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🧤 Goleiros ({totalGk})
        </button>
      </div>

      {/* Lista de Jogadores em 2 colunas com Formato de Cartas RPG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {isLoading ? (
          <div className="py-12 text-center text-slate-500 text-sm animate-pulse col-span-full">
            Carregando elenco...
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center border border-slate-800 space-y-3 col-span-full">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Nenhum jogador encontrado</h4>
            <p className="text-xs text-slate-400">
              {searchTerm
                ? 'Tente outro termo na busca.'
                : 'Cadastre o primeiro jogador clicando no botão "Novo" acima.'}
            </p>
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onRate={(p) => setRatingPlayer(p)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Modal de Cadastro / Edição */}
      <PlayerFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlayer(null);
        }}
        onSavePlayer={onSavePlayer}
        editingPlayer={editingPlayer}
        usedPhotoUrls={players.map((p) => p.photoUrl).filter(Boolean) as string[]}
      />

      {/* Modal de Avaliação de Skill */}
      <RatingModal
        isOpen={!!ratingPlayer}
        player={ratingPlayer}
        onClose={() => setRatingPlayer(null)}
        onSubmitRating={onRatePlayer}
      />

      {/* Modal de Virada de Mês / Reset */}
      <MonthlyResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={onMonthlyReset}
        totalPlayers={players.length}
      />
    </div>
  );
};
