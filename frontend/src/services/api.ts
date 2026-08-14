import axios from 'axios';

// Base URL configurada para o backend Express:
// - Em Desenvolvimento Local: http://localhost:3333/api
// - Em Produção na Vercel: usa '/api' relativo do mesmo domínio (evita alerta de rede local)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3333/api' : '/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'Erro ao se comunicar com o servidor.';
    return Promise.reject(new Error(customMessage));
  }
);
