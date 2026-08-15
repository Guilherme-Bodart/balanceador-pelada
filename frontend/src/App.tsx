import React, { useState, useEffect } from 'react';
import { Player, CreatePlayerInput, UpdatePlayerInput, DrawResponse } from './types';
import { playerService } from './services/playerService';
import { drawService } from './services/drawService';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { StadiumBackground } from './components/ui/StadiumBackground';
import { PlayersPage } from './pages/PlayersPage';
import { DrawPage } from './pages/DrawPage';
import { RulesPage } from './pages/RulesPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [drawResult, setDrawResult] = useState<DrawResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carregar jogadores
  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await playerService.getAll();
      setPlayers(data);

      // Por padrão, convoca os primeiros 10 atletas
      setSelectedPlayerIds((prev) => {
        if (prev.length === 0 && data.length > 0) {
          return data.slice(0, 10).map((p) => p.id);
        }
        return prev.filter((id) => data.some((p) => p.id === id));
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao carregar atletas.');
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

  // Toggle de seleção de presença
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

  // Executar Sorteio
  const handleDraw = async (selectedIds: string[], gkIds: string[] = []): Promise<DrawResponse | null> => {
    try {
      setIsDrawing(true);
      // Executa o sorteio em paralelo com a animação cinematográfica de 2.2s
      const [res] = await Promise.all([
        drawService.drawTeams({
          playerIds: selectedIds,
          playersPerTeam: Math.ceil(selectedIds.length / 2),
          goalkeeperIds: gkIds,
        }),
        new Promise((resolve) => setTimeout(resolve, 2200)),
      ]);
      setDrawResult(res);
      return res;
    } catch (err: any) {
      alert(err.message || 'Erro ao realizar o sorteio.');
      return null;
    } finally {
      setIsDrawing(false);
    }
  };

  const handleResetDraw = () => {
    setDrawResult(null);
  };

  return (
    <StadiumBackground>
      {/* Header Esportivo */}
      <Header />

      {/* Alerta Opcional */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={loadPlayers}
              className="underline font-bold hover:text-white ml-2 shrink-0"
            >
              Recarregar
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 pt-4">
        {activeTab === 'players' && (
          <PlayersPage
            players={players}
            selectedPlayerIds={selectedPlayerIds}
            onToggleSelect={handleToggleSelect}
            onRefresh={loadPlayers}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
            onRatePlayer={handleRatePlayer}
            onMonthlyReset={handleMonthlyReset}
            onGoToDraw={() => setActiveTab('draw')}
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
            onDraw={handleDraw}
            drawResult={drawResult}
            onResetDraw={handleResetDraw}
            isLoading={isDrawing}
          />
        )}

        {activeTab === 'rules' && <RulesPage />}
      </main>

      {/* Floating Dock Navbar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCount={selectedPlayerIds.length}
      />
    </StadiumBackground>
  );
};
