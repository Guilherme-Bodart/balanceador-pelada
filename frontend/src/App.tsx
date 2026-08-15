import React, { useState, useEffect } from 'react';
import { Player, CreatePlayerInput, UpdatePlayerInput } from './types';
import { playerService } from './services/playerService';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { PlayersPage } from './pages/PlayersPage';
import { DrawPage } from './pages/DrawPage';
import { RulesPage } from './pages/RulesPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('draw');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carregar jogadores do backend
  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await playerService.getAll();
      setPlayers(data);

      // Por padrão, seleciona os primeiros 10 jogadores se nada estiver selecionado ainda
      setSelectedPlayerIds((prev) => {
        if (prev.length === 0 && data.length > 0) {
          return data.slice(0, 10).map((p) => p.id);
        }
        // Filtra IDs que continuam existindo
        return prev.filter((id) => data.some((p) => p.id === id));
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Não foi possível conectar com o backend.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  // Handlers de Jogadores
  const handleSavePlayer = async (data: CreatePlayerInput | UpdatePlayerInput, id?: string) => {
    if (id) {
      await playerService.update(id, data as UpdatePlayerInput);
    } else {
      await playerService.create(data as CreatePlayerInput);
    }
    await loadPlayers();
  };

  const handleDeletePlayer = async (id: string) => {
    await playerService.delete(id);
    setSelectedPlayerIds((prev) => prev.filter((pid) => pid !== id));
    await loadPlayers();
  };

  const handleRatePlayer = async (id: string, rating: number) => {
    await playerService.addRating(id, rating);
    await loadPlayers();
  };

  const handleMonthlyReset = async () => {
    await playerService.monthlyReset();
    await loadPlayers();
  };

  // Toggle de seleção de atletas para o sorteio
  const handleToggleSelect = (id: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedPlayerIds(players.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedPlayerIds([]);
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header Fixo */}
      <Header />

      {/* Alerta de Erro de Conexão se Backend estiver offline */}
      {errorMessage && (
        <div className="max-w-lg sm:max-w-xl mx-auto w-full px-4 pt-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={loadPlayers}
              className="underline font-bold hover:text-white ml-2 shrink-0"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 pt-3 pb-20">
        {activeTab === 'players' && (
          <PlayersPage
            players={players}
            onRefresh={loadPlayers}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
            onRatePlayer={handleRatePlayer}
            onMonthlyReset={handleMonthlyReset}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'draw' && (
          <DrawPage
            players={players}
            selectedPlayerIds={selectedPlayerIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}

        {activeTab === 'rules' && <RulesPage />}
      </main>

      {/* Navegação Inferior Mobile-First */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCount={selectedPlayerIds.length}
      />
    </div>
  );
};
