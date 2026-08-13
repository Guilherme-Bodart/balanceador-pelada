import axios from 'axios';

// Base URL configurada para o backend Express
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

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
