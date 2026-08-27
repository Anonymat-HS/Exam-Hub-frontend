import { api } from './api';
export const authService = { login: (email, password) => api.post('/auth/login', { email, password }) };