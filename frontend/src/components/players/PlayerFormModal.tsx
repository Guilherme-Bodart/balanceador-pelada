import React, { useState, useEffect } from 'react';
import { Player, PlayerPosition, CreatePlayerInput, UpdatePlayerInput } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { POKEMON_PRESETS, PokemonPreset } from '../../constants/pokemons';
import { User, ShieldAlert, Sparkles, Image as ImageIcon, Lock } from 'lucide-react';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlayer: (data: CreatePlayerInput | UpdatePlayerInput, id?: string) => Promise<void>;
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
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [position, setPosition] = useState<PlayerPosition>('FIELD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
    if (editingPlayer) {
      setName(editingPlayer.name);
      setPhotoUrl(editingPlayer.photoUrl || '');
      setPosition(editingPlayer.position);
    } else {
      setName('');
      setPhotoUrl('');
      setPosition('FIELD');
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
      setErrorMsg('Este avatar/foto já está em uso por outro atleta. Escolha um diferente.');
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
          },
          editingPlayer.id
        );
      } else {
        await onSavePlayer({
          name: name.trim(),
          photoUrl: photoUrl.trim() || undefined,
          position,
        });
      }
      onClose();
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro ao salvar jogador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}
      subtitle={
        editingPlayer
          ? 'Atualize as informações do atleta'
          : 'Cadastre um novo atleta para o elenco'
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
              onClick={() => setPosition('FIELD')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                position === 'FIELD'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>🏃</span>
              <span>Linha</span>
            </button>

            <button
              type="button"
              onClick={() => setPosition('GOALKEEPER')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                position === 'GOALKEEPER'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Goleiro Fixo</span>
            </button>
          </div>
        </div>

        {/* Foto URL */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Foto / Avatar do Atleta
          </label>
          <div className="flex items-center gap-2.5 mb-2">
            <PlayerAvatar
              name={name || 'Atleta'}
              photoUrl={photoUrl}
              size="md"
              isGoalkeeper={position === 'GOALKEEPER'}
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
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
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

          {/* Avatares Rápidos de Pokémons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">
                Escolha um Pokémon (Sem repetição):
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {POKEMON_PRESETS.length} disponíveis
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {POKEMON_PRESETS.map((preset: PokemonPreset, idx: number) => {
                const isSelected = photoUrl === preset.url;
                const isTaken = isUrlInUse(preset.url);

                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={isTaken}
                    onClick={() => {
                      if (isTaken) return;
                      setPhotoUrl(preset.url);
                      setErrorMsg(null);
                      if (!name.trim()) {
                        setName(preset.name);
                      }
                      if (!editingPlayer) {
                        setPosition(preset.defaultPosition);
                      }
                    }}
                    title={isTaken ? `${preset.name} (Já em uso)` : preset.name}
                    className={`relative group flex flex-col items-center shrink-0 p-1 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-105 shadow-glow-emerald'
                        : isTaken
                        ? 'bg-slate-900/30 border border-slate-800/40 opacity-30 cursor-not-allowed grayscale'
                        : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-contain aspect-square group-hover:scale-110 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[9px] text-slate-300 font-medium truncate max-w-[48px] mt-0.5">
                      {preset.name}
                    </span>

                    {/* Badge de "Em uso" */}
                    {isTaken && (
                      <div className="absolute inset-0 bg-slate-950/70 rounded-xl flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </button>
                );
              })}
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
            {editingPlayer ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
