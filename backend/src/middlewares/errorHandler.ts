import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('[Error Handler]:', error.message || error);

  let statusCode = error.statusCode || 400;
  let message = error.message || 'Ocorreu um erro interno no servidor.';

  // Tratamento específico para erros comuns do Prisma e Banco de Dados
  if (error.name === 'PrismaClientInitializationError' || error.code === 'P1000' || error.code === 'P1001') {
    statusCode = 500;
    message =
      'Falha na autenticação ou conexão com o banco de dados (Neon). Verifique se a variável DATABASE_URL está configurada corretamente no .env ou no painel da Vercel.';
  } else if (error.code === 'P2002') {
    statusCode = 409;
    message = 'Já existe um registro com estes dados únicos no banco de dados.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack, code: error.code } : {}),
  });
};
