import React, { useState } from 'react';
import { Player, CreatePlayerInput, UpdatePlayerInput } from '../types';
import { PlayerFormModal } from '../components/players/PlayerFormModal';
import { RatingModal } from '../components/players/RatingModal';
import { MonthlyResetModal } from '../components/players/MonthlyResetModal';
import { ConfirmDeleteModal } from '../components/players/ConfirmDeleteModal';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/common/Button';
import { PlayerShield } from '../components/players/PlayerShield';
import { getRankInfo } from '../constants/ranks';
import { UserPlus, Search, Calendar, Users, ShieldAlert, Award, Edit3, Trash2 } from 'lucide-react';

interface PlayersPageProps {
  players: Player[];
  selectedPlayerIds?: string[];
  onToggleSelect?: (id: string) => void;
  onRefresh: () => Promise<void>;
  onSavePlayer: (data: CreatePlayerInput | UpdatePlayerInput, id?: string) => Promise<void>;
  onDeletePlayer: (id: string) => Promise<void>;
  onRatePlayer: (id: string, rating: number) => Promise<void>;
  onMonthlyReset: () => Promise<void>;
  onGoToDraw?: () => void;
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
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);

  // Estatísticas do Elenco
  const totalGk = players.filter((p) => p.position === 'GOALKEEPER').length;
  const totalField = players.length - totalGk;

  // Filtragem
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos =
      filterPosition === 'ALL' ||
      (filterPosition === 'GOALKEEPER' && p.position === 'GOALKEEPER') ||
      (filterPosition === 'FIELD' && p.position !== 'GOALKEEPER');
    return matchesSearch && matchesPos;
  });

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingPlayer(null);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (player: Player) => {
    setDeletingPlayer(player);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPlayer) return;
    try {
      setIsDeletingLoading(true);
      await onDeletePlayer(deletingPlayer.id);
      setDeletingPlayer(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir jogador.');
    } finally {
      setIsDeletingLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-3 sm:px-6 pb-24">
      {/* ================= ESTATÍSTICAS RÁPIDAS COM STATS CARDS ================= */}
      <div className="grid grid-cols-3 gap-2">
        <StatsCard
          label="Total Elenco"
          value={players.length}
          icon={<Users className="w-4 h-4 text-emerald-400" />}
          variant="emerald"
        />
        <StatsCard
          label="Goleiros"
          value={totalGk}
          icon={<ShieldAlert className="w-4 h-4 text-amber-400" />}
          variant="amber"
        />
        <StatsCard
          label="Linha"
          value={totalField}
          icon={<Users className="w-4 h-4 text-sky-400" />}
          variant="sky"
        />
      </div>

      {/* ================= BOTÃO DE VIRADA DE MÊS / CICLO ================= */}
      <button
        type="button"
        onClick={() => setIsResetModalOpen(true)}
        className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 border border-purple-500/30 hover:border-purple-400 flex items-center justify-between text-xs transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-bold text-white block">Virada de Mês (Reset de Ciclo)</span>
            <span className="text-[10px] text-slate-400">Consolida as médias e abre novo ciclo de votos</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform pr-2">
          Virar Mês →
        </span>
      </button>

      {/* ================= BARRA DE AÇÃO: BUSCA E BOTÃO NOVO ATLETA ================= */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome do atleta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <Button
          type="button"
          variant="glow"
          size="md"
          onClick={handleNew}
          className="shrink-0 rounded-2xl font-bold text-xs"
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Novo
        </Button>
      </div>

      {/* ================= TABS DE FILTRO POR POSIÇÃO (ESTILO PLACAR) ================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterPosition('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterPosition === 'ALL'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Todos ({players.length})
        </button>
        <button
          onClick={() => setFilterPosition('FIELD')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterPosition === 'FIELD'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🏃 Linha ({totalField})
        </button>
        <button
          onClick={() => setFilterPosition('GOALKEEPER')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterPosition === 'GOALKEEPER'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🧤 Goleiros ({totalGk})
        </button>
      </div>

      {/* ================= GRID DE CARDS COM ESCUDO OFICIAL FIFA CLASSIC ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm animate-pulse col-span-full">
            Carregando elenco de atletas...
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center border border-slate-800 space-y-3 col-span-full">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Nenhum jogador encontrado</h4>
            <p className="text-xs text-slate-400">
              {searchTerm ? 'Tente outro termo na busca.' : 'Cadastre um novo jogador clicando no botão "Novo" acima.'}
            </p>
          </div>
        ) : (
          filteredPlayers.map((player) => {
            const isGk = player.position === 'GOALKEEPER';
            const rInfo = getRankInfo(player.overallRating);

            return (
              <div
                key={player.id}
                className="group relative flex flex-col items-center p-2 sm:p-2.5 rounded-3xl transition-all duration-200 border bg-slate-900/90 border-slate-800/80 hover:border-slate-700 hover:scale-[1.01] shadow-lg"
              >
                {/* Escudo FIFA Oficial com Glow Neon + 5px + Cores do Rank */}
                <div className="w-full flex justify-center py-1">
                  <PlayerShield
                    name={player.name}
                    position={isGk ? 'GOLEIRO' : 'LINHA'}
                    rating={player.overallRating}
                    grade={rInfo.rank}
                    photoUrl={player.photoUrl || undefined}
                    accent={rInfo.colorHex}
                    accentAlt={rInfo.borderHex}
                    borderWidth={5}
                    glow={true}
                    effect="glow"
                    shine={true}
                    badge={isGk ? 'GOLEIRO' : rInfo.isLegend ? 'LEGEND' : undefined}
                    stats={[
                      {
                        label: 'SKL',
                        value: player.ratingCount > 0 || player.skillRating > 0 ? String(Math.round(player.skillRating * 10)) : '—',
                      },
                      { label: 'FIS', value: String(Math.round(player.physicalRating * 10)) },
                    ]}
                    className="w-full max-w-[170px] sm:max-w-[190px] h-auto"
                  />
                </div>

                {/* Barra de Ações: Avaliar + Editar + Deletar */}
                <div className="w-full mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setRatingPlayer(player)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                    title="Avaliar Habilidade"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Avaliar</span>
                    <span className="text-[10px] font-mono text-amber-400/80 font-normal">
                      ({player.ratingCount})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(player)}
                    className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95 shrink-0"
                    title="Editar Jogador"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRequest(player)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all active:scale-95 shrink-0"
                    title="Excluir Jogador"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAIS ================= */}
      <PlayerFormModal
        isOpen={isFormOpen}
        editingPlayer={editingPlayer}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlayer(null);
        }}
        onSavePlayer={onSavePlayer}
        usedPhotoUrls={players.map((p) => p.photoUrl).filter(Boolean) as string[]}
      />

      {/* Modal de Avaliação Confidencial com referência dinâmica */}
      <RatingModal
        isOpen={!!ratingPlayer}
        player={ratingPlayer ? (players.find((p) => p.id === ratingPlayer.id) || ratingPlayer) : null}
        onClose={() => setRatingPlayer(null)}
        onSubmitRating={onRatePlayer}
      />

      <MonthlyResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={onMonthlyReset}
        totalPlayers={players.length}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingPlayer}
        player={deletingPlayer}
        onClose={() => setDeletingPlayer(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingLoading}
      />
    </div>
  );
};
