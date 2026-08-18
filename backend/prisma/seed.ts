import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pokemonPlayers = [
  // Goleiros
  {
    name: 'Blastoise (Goleiro)',
    position: 'GOALKEEPER',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/9.png',
    ratings: [9.0, 9.2, 9.5],
  },
  {
    name: 'Snorlax Paredão',
    position: 'GOALKEEPER',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/143.png',
    ratings: [8.8, 8.5, 9.0],
  },
  {
    name: 'Machamp 4 Braços',
    position: 'GOALKEEPER',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/68.png',
    ratings: [8.2, 8.0, 8.5],
  },

  // Jogadores de Linha
  {
    name: 'Typhlosion Fogo',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/157.png',
    ratings: [9.4, 9.6, 9.2],
  },
  {
    name: 'Charizard Artilheiro',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/6.png',
    ratings: [9.6, 9.8, 9.5],
  },
  {
    name: 'Mewtwo Camisa 10',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/150.png',
    ratings: [9.8, 9.9, 9.7],
  },
  {
    name: 'Pikachu Veloz',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/25.png',
    ratings: [8.5, 8.8, 8.3],
  },
  {
    name: 'Lucario Maestro',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/448.png',
    ratings: [9.0, 9.2, 8.9],
  },
  {
    name: 'Greninja Drible',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/658.png',
    ratings: [9.1, 8.9, 9.3],
  },
  {
    name: 'Gengar Liso',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/94.png',
    ratings: [8.6, 8.4, 8.8],
  },
  {
    name: 'Dragonite Tanque',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/149.png',
    ratings: [8.7, 8.5, 8.9],
  },
  {
    name: 'Gyarados Raça',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/130.png',
    ratings: [8.3, 8.5, 8.1],
  },
  {
    name: 'Garchomp Zagueiro',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/445.png',
    ratings: [8.8, 8.6, 9.0],
  },
  {
    name: 'Venusaur Xerife',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/3.png',
    ratings: [8.0, 8.2, 7.8],
  },
  {
    name: 'Rayquaza Craque',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/384.png',
    ratings: [9.7, 9.5, 9.8],
  },
  {
    name: 'Arcanine Motorzinho',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/59.png',
    ratings: [8.1, 7.9, 8.3],
  },
  {
    name: 'Scizor Lateral',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/212.png',
    ratings: [7.8, 8.0, 7.6],
  },
  {
    name: 'Alakazam Visão de Jogo',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/65.png',
    ratings: [8.4, 8.2, 8.6],
  },
  {
    name: 'Umbreon Marcador',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/197.png',
    ratings: [7.5, 7.8, 7.2],
  },
  {
    name: 'Eevee Promessa (Sem Nota)',
    position: 'FIELD',
    photoUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/133.png',
    ratings: [], // Média 5.0 padrão
  },
];

async function main() {
  console.log('⚽ Populando banco de dados com os 20 Pokémons atletas...');

  await prisma.rating.deleteMany();
  await prisma.player.deleteMany();

  for (const p of pokemonPlayers) {
    const created = await prisma.player.create({
      data: {
        name: p.name,
        position: p.position,
        photoUrl: p.photoUrl,
      },
    });

    if (p.ratings.length > 0) {
      for (const val of p.ratings) {
        await prisma.rating.create({
          data: {
            value: val,
            playerId: created.id,
          },
        });
      }
    }
  }

  console.log(`✅ Seed concluído! ${pokemonPlayers.length} Pokémons cadastrados com sucesso (incluindo Typhlosion!).`);
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
