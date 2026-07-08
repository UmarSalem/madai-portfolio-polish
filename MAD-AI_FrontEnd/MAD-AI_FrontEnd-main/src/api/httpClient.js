import axios from 'axios';
import { Config } from '../constant';

const httpClient = axios.create({
  baseURL: Config.serverUrl,
});

httpClient.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem(Config.userApiTokenName));
  if (storedUser?.token) {
    config.headers.Authorization = `Bearer ${storedUser.token}`;
  }
  return config;
});

export default httpClient;