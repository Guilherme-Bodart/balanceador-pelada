import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { appRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = () => {
  const app = express();

  // Middlewares globais
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Permite payloads de JSON com imagens em base64 (até 10mb)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rotas da API
  app.use('/api', appRouter);

  // 404 Handler para rotas inexistentes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
    });
  });

  // Middleware de Erros Centralizado
  app.use(errorHandler);

  return app;
};
