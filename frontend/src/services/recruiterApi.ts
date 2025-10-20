import api from './api';
import { Recruiter } from '../types/api';

export async function getRecruiters(filters?: {
  status?: string;
}): Promise<Recruiter[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);

  const response = await api.get<Recruiter[]>(
    `/recruiters${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
}

export async function getRecruiterById(id: string): Promise<Recruiter> {
  const response = await api.get<Recruiter>(`/recruiters/${id}`);
  return response.data;
}

export async function createRecruiter(
  data: Partial<Recruiter>
): Promise<Recruiter> {
  const response = await api.post<Recruiter>('/recruiters', data);
  return response.data;
}

export async function updateRecruiter(
  id: string,
  data: Partial<Recruiter>
): Promise<Recruiter> {
  const response = await api.put<Recruiter>(`/recruiters/${id}`, data);
  return response.data;
}

export async function updateRecruiterStatus(
  id: string,
  status: string,
  notes?: string
): Promise<Recruiter> {
  const response = await api.post<Recruiter>(`/recruiters/${id}/status`, {
    status,
    notes,
  });
  return response.data;
}

export async function deleteRecruiter(id: string): Promise<void> {
  await api.delete(`/recruiters/${id}`);
}

export async function getWeeklyConnectionCount(): Promise<{ count: number }> {
  const response = await api.get<{ count: number }>('/recruiters/weekly-count');
  return response.data;
}

export async function getLinkedInSearchUrls(): Promise<{
  searchUrls: Array<{ description: string; url: string }>;
}> {
  const response = await api.get('/recruiters/search/linkedin-urls');
  return response.data;
}

export async function generateContactMessages(
  recruiterId: string,
  language?: 'en' | 'pt'
): Promise<Recruiter> {
  const response = await api.post<Recruiter>(
    `/recruiters/${recruiterId}/generate-messages`,
    { language }
  );
  return response.data;
}
