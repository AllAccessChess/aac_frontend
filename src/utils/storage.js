import { AUTH_TOKEN_STORAGE_KEY } from "constant";

export const getAuthToken = () => {
  return JSON.parse(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
};

export const setAuthToken = (tokenInfo) => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(tokenInfo));
};

export const clearTokens = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};
