import api from './api';

export async function initiateLinkedInAuth(): Promise<{ authUrl: string }> {
  const response = await api.get<{ authUrl: string }>('/linkedin/auth');
  return response.data;
}

export async function handleLinkedInCallback(
  code: string,
  state: string
): Promise<{ success: boolean; user: any }> {
  const response = await api.get<{ success: boolean; user: any }>(
    `/linkedin/callback?code=${code}&state=${state}`
  );
  return response.data;
}

export async function disconnectLinkedIn(): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>('/linkedin/disconnect');
  return response.data;
}
