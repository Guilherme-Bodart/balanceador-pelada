# ⚽ Sorteador de Times Pro

Sistema web completo de alta performance para gerenciar jogadores de futebol, atribuir notas e sortear times perfeitamente equilibrados através de algoritmos de **Snake Draft** e **Otimização Gulosa por Trocas (Local Search)**, com separação automática de goleiros fixos.

---

## 🌟 Principais Funcionalidades

1. **Gestão Completa de Elenco (Linha e Goleiros)**:
   - Cadastro e edição com nome, foto (URL ou presets) e posição (`FIELD` ou `GOALKEEPER`).
   - Média de notas automática com histórico de avaliações.
   - **Regra de Negócio**: Jogadores novos sem avaliações recebem a nota padrão neutra **5.0**.

2. **Algoritmo de Equilíbrio Matemático Pro**:
   - Aloca 1 goleiro para cada time de forma proporcional.
   - Distribui jogadores de linha com o método **Snake Draft** (`A, B, B, A...`).
   - Aplica otimização por trocas para minimizar a diferença absoluta de notas (`|Soma(A) - Soma(B)| <= 1.5`).
   - Separa banco de reservas para os atletas excedentes.

3. **Interface 100% Mobile-First**:
   - Tema escuro esportivo moderno (Glassmorphism, Verde Esmeralda, Lima, Âmbar).
   - Efeitos visuais táteis e animação de confetes ao sortear.
   - 1-clique para copiar a escalação formatada ou abrir direto no **WhatsApp**.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos:
- **Node.js** >= 18.x
- **npm** >= 9.x

### 1. Iniciar o Backend (API REST + Prisma + SQLite):
```bash
cd backend
npm install
npm run prisma:push
npm run prisma:seed   # Popula 16 jogadores reais para testes imediatos
npm run dev           # Roda em http://localhost:3333
```

### 2. Iniciar o Frontend (React + Vite + Tailwind):
```bash
cd frontend
npm install
npm run dev           # Roda em http://localhost:5173
```

Acesse **http://localhost:5173** no seu navegador (ou no celular via rede local)!

---

## 📁 Estrutura do Projeto

```
balanceador-pelada/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos Player e Rating (SQLite)
│   │   └── seed.ts             # 16 atletas com fotos e notas de teste
│   ├── src/
│   │   ├── config/prisma.ts    # Singleton PrismaClient
│   │   ├── controllers/        # PlayerController e DrawController
│   │   ├── services/           # DrawService (Algoritmo) e PlayerService
│   │   ├── routes/             # Rotas REST (/api/players, /api/draw)
│   │   ├── middlewares/        # Error handler centralizado
│   │   ├── types/              # Tipos TypeScript e DTOs
│   │   ├── app.ts              # Configuração Express e CORS
│   │   └── server.ts           # Inicialização do servidor na porta 3333
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/         # Header, BottomNav, Button, Badge, Modal
    │   │   ├── players/        # PlayerCard, PlayerFormModal, RatingModal
    │   │   └── draw/           # DrawConfig, TeamDisplay, ShareModal
    │   ├── pages/              # PlayersPage, DrawPage, RulesPage
    │   ├── services/           # Axios API, playerService, drawService
    │   ├── types/              # Modelos de dados
    │   ├── App.tsx             # Gerenciamento de abas e fluxo principal
    │   ├── main.tsx
    │   └── index.css           # Tailwind + Glassmorphism esportivo
    └── package.json
```
