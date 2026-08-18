export interface PokemonItem {
  id: number;
  name: string;
  displayName: string;
  photoUrl: string;
}

/**
 * Converte qualquer URL legada da PokeAPI (raw.githubusercontent.com)
 * para a CDN global de alta performance (cdn.jsdelivr.net).
 */
export function normalizePokemonPhotoUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.replace(
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/',
    'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/'
  );
}

let cachedPokemonList: PokemonItem[] | null = null;
let fetchPromise: Promise<PokemonItem[]> | null = null;

// Lista inicial de Pokémons populares para carregamento instantâneo via CDN jsDelivr
export const POPULAR_POKEMONS: PokemonItem[] = [
  { id: 25, name: 'pikachu', displayName: 'Pikachu', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/25.png' },
  { id: 6, name: 'charizard', displayName: 'Charizard', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/6.png' },
  { id: 150, name: 'mewtwo', displayName: 'Mewtwo', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/150.png' },
  { id: 94, name: 'gengar', displayName: 'Gengar', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/94.png' },
  { id: 448, name: 'lucario', displayName: 'Lucario', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/448.png' },
  { id: 658, name: 'greninja', displayName: 'Greninja', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/658.png' },
  { id: 143, name: 'snorlax', displayName: 'Snorlax', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/143.png' },
  { id: 9, name: 'blastoise', displayName: 'Blastoise', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/9.png' },
  { id: 149, name: 'dragonite', displayName: 'Dragonite', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/149.png' },
  { id: 445, name: 'garchomp', displayName: 'Garchomp', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/445.png' },
  { id: 384, name: 'rayquaza', displayName: 'Rayquaza', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/384.png' },
  { id: 130, name: 'gyarados', displayName: 'Gyarados', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/130.png' },
  { id: 59, name: 'arcanine', displayName: 'Arcanine', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/59.png' },
  { id: 157, name: 'typhlosion', displayName: 'Typhlosion', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/157.png' },
  { id: 248, name: 'tyranitar', displayName: 'Tyranitar', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/248.png' },
  { id: 133, name: 'eevee', displayName: 'Eevee', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/133.png' },
  { id: 197, name: 'umbreon', displayName: 'Umbreon', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/197.png' },
  { id: 212, name: 'scizor', displayName: 'Scizor', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/212.png' },
  { id: 392, name: 'infernape', displayName: 'Infernape', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/392.png' },
  { id: 254, name: 'sceptile', displayName: 'Sceptile', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/254.png' },
  { id: 257, name: 'blaziken', displayName: 'Blaziken', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/257.png' },
  { id: 3, name: 'venusaur', displayName: 'Venusaur', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/3.png' },
  { id: 68, name: 'machamp', displayName: 'Machamp', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/68.png' },
  { id: 807, name: 'zeraora', displayName: 'Zeraora', photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/807.png' },
];

/**
 * Busca a lista de todos os 1025 Pokémons da PokeAPI oficial.
 * É executado apenas uma vez e fica em cache na memória do navegador.
 */
export async function getFullPokemonList(): Promise<PokemonItem[]> {
  if (cachedPokemonList) return cachedPokemonList;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
      if (!res.ok) throw new Error('Falha ao consultar PokeAPI');
      const data = await res.json();

      const items: PokemonItem[] = data.results.map((p: { name: string; url: string }, index: number) => {
        const id = index + 1;
        const displayName = p.name
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        return {
          id,
          name: p.name.toLowerCase(),
          displayName,
          photoUrl: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });

      cachedPokemonList = items;
      return items;
    } catch {
      // Fallback para os populares se a PokeAPI estiver offline
      return POPULAR_POKEMONS;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Filtra os Pokémons pelo termo pesquisado (nome ou número da pokédex).
 */
export function filterPokemons(
  allPokemons: PokemonItem[],
  query: string,
  limit = 24
): PokemonItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return allPokemons.slice(0, limit);
  }

  // Se pesquisou por número (#25, 25)
  const isNumber = /^\d+$/.test(clean.replace('#', ''));
  if (isNumber) {
    const num = parseInt(clean.replace('#', ''), 10);
    return allPokemons.filter((p) => p.id === num).slice(0, limit);
  }

  // Filtra por nome com correspondência exata primeiro
  const exact: PokemonItem[] = [];
  const startsWith: PokemonItem[] = [];
  const contains: PokemonItem[] = [];

  for (const p of allPokemons) {
    if (p.name === clean) {
      exact.push(p);
    } else if (p.name.startsWith(clean)) {
      startsWith.push(p);
    } else if (p.name.includes(clean)) {
      contains.push(p);
    }
    if (exact.length + startsWith.length + contains.length >= limit * 2) {
      break;
    }
  }

  return [...exact, ...startsWith, ...contains].slice(0, limit);
}
