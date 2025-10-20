import api from './api';
import { User, AuthResponse } from '../types/api';
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from '../utils/tokenStorage';

export async function register(
  email: string,
  password: string,
  name: string,
  timezone?: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    name,
    timezone,
  });

  const { accessToken, refreshToken, user } = response.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });

  const { accessToken, refreshToken, user } = response.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return response.data;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post<{ accessToken: string }>('/auth/refresh', {
    refreshToken,
  });

  const { accessToken } = response.data;
  setAccessToken(accessToken);

  return accessToken;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}

export function logout(): void {
  clearTokens();
}
