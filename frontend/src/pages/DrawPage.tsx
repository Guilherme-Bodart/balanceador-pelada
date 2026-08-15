import React, { useState } from 'react';
import { Player, DrawResponse } from '../types';
import { PlayerShield } from '../components/players/PlayerShield';
import { DrawResultPanel } from '../components/draw/DrawResultPanel';
import { DrawLoadingOverlay } from '../components/draw/DrawLoadingOverlay';
import { ShareModal } from '../components/draw/ShareModal';
import { Button } from '../components/common/Button';
import { getRankInfo } from '../constants/ranks';
import { Search, Shuffle, CheckCircle2, AlertCircle, ArrowLeft, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawPageProps {
  players: Player[];
  selectedPlayerIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDraw: (selectedIds: string[], gkIds?: string[]) => Promise<DrawResponse | null>;
  drawResult: DrawResponse | null;
  onResetDraw: () => void;
  isLoading: boolean;
}

export const DrawPage: React.FC<DrawPageProps> = ({
  players,
  selectedPlayerIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDraw,
  drawResult,
  onResetDraw,
  isLoading,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [filterView, setFilterView] = useState<'ALL' | 'SELECTED' | 'GK'>('ALL');
  const [customGkOverrides, setCustomGkOverrides] = useState<Record<string, boolean>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Determina se o atleta está escalado como goleiro (padrão do banco ou sobrescrito na sessão)
  const isPlayerGk = (player: Player) => {
    if (customGkOverrides[player.id] !== undefined) {
      return customGkOverrides[player.id];
    }
    return player.position === 'GOALKEEPER';
  };

  // Goleiros Selecionados
  const selectedPlayers = players.filter((p) => selectedPlayerIds.includes(p.id));
  const selectedGkCount = selectedPlayers.filter((p) => isPlayerGk(p)).length;

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase());
    const isSelected = selectedPlayerIds.includes(p.id);
    const isGk = isPlayerGk(p);

    if (filterView === 'SELECTED') return matchesSearch && isSelected;
    if (filterView === 'GK') return matchesSearch && isGk;
    return matchesSearch;
  });

  const handleToggleGoalkeeper = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const player = players.find((p) => p.id === id);
    if (!player) return;
    const currentIsGk = isPlayerGk(player);
    setCustomGkOverrides((prev) => ({
      ...prev,
      [id]: !currentIsGk,
    }));
  };

  const handleExecuteDraw = async () => {
    if (selectedPlayerIds.length < 2) {
      alert('Selecione ao menos 2 atletas para realizar o sorteio.');
      return;
    }
    const currentGkIds = selectedPlayers
      .filter((p) => isPlayerGk(p))
      .map((p) => p.id);

    await onDraw(selectedPlayerIds, currentGkIds);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-28">
      <AnimatePresence mode="wait">
        {drawResult ? (
          /* ================= TELA DE RESULTADO DOS TIMES (TIME VERMELHO VS TIME AZUL) ================= */
          <motion.div
            key="draw-result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-3 flex items-center justify-start">
              <button
                type="button"
                onClick={onResetDraw}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Editar Convocação</span>
              </button>
            </div>

            <DrawResultPanel
              drawResult={drawResult}
              onDrawAgain={handleExecuteDraw}
              onShare={() => setIsShareModalOpen(true)}
              isLoading={isLoading}
            />

            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              drawData={drawResult}
            />
          </motion.div>
        ) : (
          /* ================= TELA DE CONVOCAÇÃO COM ESCUDOS FIFA (PRÉ-SORTEIO) ================= */
          <motion.div
            key="draw-selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Header Compacto de Convocação (Otimizado para Mobile) */}
            <div className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-slate-800 flex items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedPlayerIds.length} Convocados</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  (<strong className="text-amber-400">{selectedGkCount}</strong> gol)
                </span>
              </div>

              {/* Ações Rápidas de Seleção */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-bold text-slate-200 border border-slate-700 transition-colors"
                >
                  Todos ({players.length})
                </button>
                <button
                  type="button"
                  onClick={onDeselectAll}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-bold text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Alerta se houver menos de 2 goleiros */}
            {selectedPlayerIds.length >= 6 && selectedGkCount < 2 && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Dica: Para uma pelada equilibrada com 2 times, defina ao menos 2 goleiros clicando no botão 🧤 abaixo do escudo.
                </span>
              </div>
            )}

            {/* Barra de Busca e Filtros Rápidos */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar atleta no elenco..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtros de Visualização */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setFilterView('ALL')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterView === 'ALL'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Todos ({players.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterView('SELECTED')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterView === 'SELECTED'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  ✓ Convocados ({selectedPlayerIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterView('GK')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterView === 'GK'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  🧤 Goleiros
                </button>
              </div>
            </div>

            {/* Grid de Escudos FIFA Compactos e Interativos (Pré-Sorteio) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
              {filteredPlayers.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.id);
                const isGk = isPlayerGk(player);
                const rInfo = getRankInfo(player.overallRating);

                return (
                  <div
                    key={player.id}
                    onClick={() => onToggleSelect(player.id)}
                    className={`group relative flex flex-col items-center p-2 sm:p-2.5 rounded-3xl transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-50 hover:opacity-85 hover:border-slate-700'
                    }`}
                  >
                    {/* Badge de Seleção / Check no topo direito */}
                    <div className="absolute top-3 right-3 z-30">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-800/80 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                      </div>
                    </div>

                    {/* Escudo FIFA Compacto */}
                    <div className="w-full flex justify-center py-1">
                      <PlayerShield
                        name={player.name}
                        position={isGk ? 'GOLEIRO' : 'LINHA'}
                        rating={player.overallRating}
                        grade={rInfo.rank}
                        photoUrl={player.photoUrl || undefined}
                        accent={isSelected ? rInfo.colorHex : '#64748b'}
                        accentAlt={isSelected ? rInfo.borderHex : '#334155'}
                        borderWidth={5}
                        glow={isSelected}
                        effect={isSelected ? 'glow' : 'none'}
                        shine={isSelected}
                        badge={isGk ? 'GOLEIRO' : isSelected ? 'CONVOCADO' : undefined}
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

                    {/* Botões de Ação Divididos no Meio (50% / 50%): Goleiro/Linha + Joga/Fora */}
                    <div className="w-full mt-2 pt-1.5 border-t border-white/5 grid grid-cols-2 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={(e) => handleToggleGoalkeeper(player.id, e)}
                        className={`w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl font-bold transition-all border text-center ${
                          isGk
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                            : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200'
                        }`}
                        title="Alternar entre Goleiro e Linha"
                      >
                        {isGk ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Goleiro</span>
                          </>
                        ) : (
                          <span>🏃 Linha</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelect(player.id);
                        }}
                        className={`w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl font-black text-[11px] transition-all border text-center ${
                          isSelected
                            ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-300 shadow-sm'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:text-slate-300'
                        }`}
                        title={isSelected ? 'Clique para retirar da convocação' : 'Clique para convocar'}
                      >
                        {isSelected ? '✓ JOGA' : 'FORA'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= BOTÃO FLUTUANTE PROEMINENTE "SORTEAR TIMES" ================= */}
            <div className="fixed bottom-20 left-0 right-0 z-30 px-4 pointer-events-none flex justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pointer-events-auto"
              >
                <Button
                  type="button"
                  variant="glow"
                  size="lg"
                  onClick={handleExecuteDraw}
                  disabled={selectedPlayerIds.length < 2 || isLoading}
                  isLoading={isLoading}
                  leftIcon={<Shuffle className="w-5 h-5" />}
                  className="rounded-full !px-8 !py-3.5 text-sm font-black shadow-[0_10px_25px_rgba(16,185,129,0.4)] uppercase tracking-wider"
                >
                  {selectedPlayerIds.length >= 2
                    ? `Sortear os ${selectedPlayerIds.length} Atletas Convocados`
                    : 'Selecione ao menos 2 atletas'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= OVERLAY CINEMATOGRÁFICO DE LOADING DO SORTEIO ================= */}
      <DrawLoadingOverlay
        isOpen={isLoading}
        players={selectedPlayers.length > 0 ? selectedPlayers : players}
      />
    </div>
  );
};
