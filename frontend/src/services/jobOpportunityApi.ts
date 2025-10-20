import api from './api';
import { JobOpportunity } from '../types/api';

export async function getJobOpportunities(filters?: {
  stage?: string;
}): Promise<JobOpportunity[]> {
  const params = new URLSearchParams();
  if (filters?.stage) params.append('stage', filters.stage);

  const response = await api.get<JobOpportunity[]>(
    `/opportunities${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
}

export async function getJobOpportunityById(id: string): Promise<JobOpportunity> {
  const response = await api.get<JobOpportunity>(`/opportunities/${id}`);
  return response.data;
}

export async function createJobOpportunity(
  data: Partial<JobOpportunity>
): Promise<JobOpportunity> {
  const response = await api.post<JobOpportunity>('/opportunities', data);
  return response.data;
}

export async function updateJobOpportunity(
  id: string,
  data: Partial<JobOpportunity>
): Promise<JobOpportunity> {
  const response = await api.put<JobOpportunity>(`/opportunities/${id}`, data);
  return response.data;
}

export async function updateJobStage(
  id: string,
  stage: string,
  notes?: string
): Promise<JobOpportunity> {
  const response = await api.post<JobOpportunity>(`/opportunities/${id}/stage`, {
    stage,
    notes,
  });
  return response.data;
}

export async function deleteJobOpportunity(id: string): Promise<void> {
  await api.delete(`/opportunities/${id}`);
}
