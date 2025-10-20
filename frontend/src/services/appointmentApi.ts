import api from './api';
import { Appointment } from '../types/api';

export async function getAppointments(filters?: {
  type?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Appointment[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const response = await api.get<Appointment[]>(
    `/appointments${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const response = await api.get<Appointment>(`/appointments/${id}`);
  return response.data;
}

export async function createAppointment(
  data: Partial<Appointment>
): Promise<Appointment> {
  const response = await api.post<Appointment>('/appointments', data);
  return response.data;
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Promise<Appointment> {
  const response = await api.put<Appointment>(`/appointments/${id}`, data);
  return response.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/${id}`);
}
