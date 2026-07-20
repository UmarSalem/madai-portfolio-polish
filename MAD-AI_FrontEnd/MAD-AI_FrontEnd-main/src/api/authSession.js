import { Config } from '../constant';

export const normalizeAuthUser = (data) => {
  const id = data?.id || data?.userId || data?.UserId || null;
  const token = data?.token || data?.Token || '';
  const email = data?.email || data?.Email || '';
  const role = data?.role || data?.Role || '';

  return {
    id,
    userId: id,
    token,
    email,
    role,
  };
};

export const getStoredAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(Config.userApiTokenName) || 'null');
  } catch {
    return null;
  }
};

export const saveAuthUser = (data) => {
  const user = normalizeAuthUser(data);
  localStorage.setItem(Config.userApiTokenName, JSON.stringify(user));
  return user;
};

export const clearAuthUser = () => {
  localStorage.removeItem(Config.userApiTokenName);
};
