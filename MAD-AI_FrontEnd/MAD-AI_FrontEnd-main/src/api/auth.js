import httpClient from './httpClient';

export const login = (email, password) =>
  httpClient.post('/api/auth/signin', { email, password });

export const register = (data) =>
  httpClient.post('/api/auth/signup', data);

export const getMyProfile = () =>
  httpClient.get('/api/user/me');

export const updateMyProfile = (data) =>
  httpClient.put('/api/user/me', data);
