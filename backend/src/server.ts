import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { prisma } from './config/prisma';

const PORT = process.env.PORT || 3333;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Sorteador de Times Pro - Backend Online`);
  console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`⚽ API Pronta para uso em: http://localhost:${PORT}/api`);
  console.log(`=========================================`);
});

// Encerramento gracioso
const gracefulShutdown = async (signal: string) => {
  console.log(`\nRecebido sinal ${signal}. Encerrando conexão com banco e servidor...`);
  try {
    await prisma.$disconnect();
    server.close(() => {
      console.log('Servidor HTTP encerrado.');
      process.exit(0);
    });
  } catch (error) {
    console.error('Erro ao encerrar graciosamente:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
