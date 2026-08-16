import React, { useState, useEffect } from "react";
import {
  Player,
  PlayerPosition,
  CreatePlayerInput,
  UpdatePlayerInput,
} from "../../types";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { PlayerAvatar } from "../common/PlayerAvatar";
import {
  PokemonItem,
  POPULAR_POKEMONS,
  getFullPokemonList,
  filterPokemons,
} from "../../services/pokemonService";
import {
  User,
  ShieldAlert,
  Sparkles,
  Image as ImageIcon,
  Lock,
  Activity,
  Search,
} from "lucide-react";

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlayer: (
    data: CreatePlayerInput | UpdatePlayerInput,
    id?: string,
  ) => Promise<void>;
  editingPlayer?: Player | null;
  usedPhotoUrls?: string[];
}

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  isOpen,
  onClose,
  onSavePlayer,
  editingPlayer,
  usedPhotoUrls = [],
}) => {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("FIELD");
  const [physicalRating, setPhysicalRating] = useState<number>(5.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pokémons da PokeAPI
  const [allPokemons, setAllPokemons] = useState<PokemonItem[]>(POPULAR_POKEMONS);
  const [pokemonSearch, setPokemonSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      getFullPokemonList().then((list) => {
        setAllPokemons(list);
      });
    }
  }, [isOpen]);

  const displayedPokemons = filterPokemons(allPokemons, pokemonSearch, 36);

  useEffect(() => {
    setErrorMsg(null);
    setPokemonSearch("");
    if (editingPlayer) {
      setName(editingPlayer.name);
      setPhotoUrl(editingPlayer.photoUrl || "");
      setPosition(editingPlayer.position);
      setPhysicalRating(editingPlayer.physicalRating ?? 0.0);
    } else {
      setName("");
      setPhotoUrl("");
      setPosition("FIELD");
      setPhysicalRating(0.0);
    }
  }, [editingPlayer, isOpen]);

  // Verifica se uma URL já está em uso por outro atleta
  const isUrlInUse = (url: string) => {
    if (!url) return false;
    if (editingPlayer && editingPlayer.photoUrl === url) return false;
    return usedPhotoUrls.includes(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) return;

    if (photoUrl && isUrlInUse(photoUrl)) {
      setErrorMsg(
        "Este avatar/foto já está em uso por outro atleta. Escolha um diferente.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingPlayer) {
        await onSavePlayer(
          {
            name: name.trim(),
            photoUrl: photoUrl.trim() || undefined,
            position,
            physicalRating,
          },
          editingPlayer.id,
        );
      } else {
        await onSavePlayer({
          name: name.trim(),
          photoUrl: photoUrl.trim() || undefined,
          position,
          physicalRating,
        });
      }
      onClose();
    } catch (error: any) {
      setErrorMsg(error.message || "Erro ao salvar jogador.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPlayer ? "Editar Jogador" : "Novo Jogador"}
      subtitle={
        editingPlayer
          ? "Atualize as informações do atleta"
          : "Cadastre um novo atleta para o elenco"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alerta de Erro de Validação */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* Nome */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Nome do Jogador *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Ex: Pikachu, Typhlosion..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
            />
            <User className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Posição */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Posição Principal
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPosition("FIELD")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                position === "FIELD"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span>🏃</span>
              <span>Linha</span>
            </button>

            <button
              type="button"
              onClick={() => setPosition("GOALKEEPER")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                position === "GOALKEEPER"
                  ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Goleiro Fixo</span>
            </button>
          </div>
        </div>

        {/* Nota Base Opcional de Condicionamento Físico */}
        <div className="glass-card rounded-2xl p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Nota Base Inicial de Físico (40% peso)</span>
            </label>
            <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              🏃 {physicalRating > 0 ? `${physicalRating.toFixed(1)} / 10` : '0 (Sem base)'}
            </span>
          </div>

          <input
            type="range"
            min="0.0"
            max="10.0"
            step="0.5"
            value={physicalRating}
            onChange={(e) => setPhysicalRating(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.0 (Sem base inicial)</span>
            <span>5.0 (Médio)</span>
            <span>10.0 (Gás infinito)</span>
          </div>
        </div>

        {/* Foto URL */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Foto / Avatar do Atleta
          </label>
          <div className="flex items-center gap-2.5 mb-2">
            <PlayerAvatar
              name={name || "Atleta"}
              photoUrl={photoUrl}
              size="md"
              isGoalkeeper={position === "GOALKEEPER"}
            />
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="URL da imagem..."
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none text-xs ${
                  isUrlInUse(photoUrl)
                    ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
              <ImageIcon className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Aviso se a URL digitada já estiver em uso */}
          {photoUrl && isUrlInUse(photoUrl) && (
            <span className="text-[11px] text-rose-400 font-medium block mb-1.5">
              ⚠️ Esta foto já está em uso por outro atleta!
            </span>
          )}

          {/* Seletor com Busca da PokeAPI (1025 Pokémons) */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Escolha seu Pokémon Oficial:</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                1025 Disponíveis
              </span>
            </div>

            {/* Input de Busca Rápida de Pokémon */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nome ou nº (ex: Pikachu, Gengar, Mewtwo, 150)..."
                value={pokemonSearch}
                onChange={(e) => setPokemonSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {pokemonSearch && (
                <button
                  type="button"
                  onClick={() => setPokemonSearch("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grid / Carrossel de Pokémons Pesquisados */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin max-h-[140px]">
              {displayedPokemons.length === 0 ? (
                <div className="py-3 text-center text-xs text-slate-500 w-full font-mono">
                  Nenhum Pokémon encontrado para "{pokemonSearch}".
                </div>
              ) : (
                displayedPokemons.map((pokemon) => {
                  const isSelected = photoUrl === pokemon.photoUrl;
                  const isTaken = isUrlInUse(pokemon.photoUrl);

                  return (
                    <button
                      type="button"
                      key={pokemon.id}
                      disabled={isTaken}
                      onClick={() => {
                        if (isTaken) return;
                        setPhotoUrl(pokemon.photoUrl);
                        setErrorMsg(null);
                        if (!name.trim()) {
                          setName(pokemon.displayName);
                        }
                      }}
                      title={isTaken ? `${pokemon.displayName} (Já em uso)` : `#${pokemon.id} ${pokemon.displayName}`}
                      className={`relative group flex flex-col items-center shrink-0 p-1.5 rounded-xl transition-all border ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-400 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                          : isTaken
                            ? "bg-slate-900/30 border-slate-800/40 opacity-30 cursor-not-allowed grayscale"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                        <img
                          src={pokemon.photoUrl}
                          alt={pokemon.displayName}
                          className="w-full h-full object-contain aspect-square group-hover:scale-110 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[9px] text-slate-300 font-bold truncate max-w-[56px] mt-0.5 text-center">
                        {pokemon.displayName}
                      </span>
                      <span className="text-[8px] text-slate-500 font-mono">
                        #{pokemon.id}
                      </span>

                      {/* Badge de "Em uso" */}
                      {isTaken && (
                        <div className="absolute inset-0 bg-slate-950/75 rounded-xl flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {editingPlayer ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
