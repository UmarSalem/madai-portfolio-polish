import axios from 'axios';
import { Config, requireApiConfiguration } from '../constant';
import { getStoredAuthUser } from './authSession';

const httpClient = axios.create({
  baseURL: Config.serverUrl,
});

httpClient.interceptors.request.use((config) => {
  requireApiConfiguration();
  const storedUser = getStoredAuthUser();
  if (storedUser?.token) {
    config.headers.Authorization = `Bearer ${storedUser.token}`;
  }
  return config;
});

export default httpClient;
