import httpClient from './httpClient';

export const login = (email, password) =>
  httpClient.post('/api/auth/signin', { email, password });

export const register = (data) =>
  httpClient.post('/api/auth/register', data);