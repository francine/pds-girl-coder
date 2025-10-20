import api from './api';
import { Post } from '../types/api';

export async function getPosts(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const response = await api.get<Post[]>(
    `/posts${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
}

export async function getPostById(id: string): Promise<Post> {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
}

export async function createPost(data: {
  content: string;
  postIdeaId?: string;
  scheduledAt?: string;
}): Promise<Post> {
  const response = await api.post<Post>('/posts', data);
  return response.data;
}

export async function updatePost(
  id: string,
  data: {
    content?: string;
    status?: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduledAt?: string;
  }
): Promise<Post> {
  const response = await api.put<Post>(`/posts/${id}`, data);
  return response.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}

export async function schedulePost(
  id: string,
  scheduledAt: string
): Promise<Post> {
  const response = await api.post<Post>(`/posts/${id}/schedule`, {
    scheduledAt,
  });
  return response.data;
}

export async function retryFailedPost(id: string): Promise<Post> {
  const response = await api.post<Post>(`/posts/${id}/retry`);
  return response.data;
}

export async function getWeeklyPostCount(): Promise<{ count: number }> {
  const response = await api.get<{ count: number }>('/posts/weekly-count');
  return response.data;
}

export async function generateContent(
  postIdeaId: string,
  tone?: string,
  maxWords?: number
): Promise<{ content: string }> {
  const response = await api.post<{ content: string }>('/posts/generate', {
    postIdeaId,
    tone,
    maxWords,
  });
  return response.data;
}

export async function getScheduledPostsForCalendar(): Promise<any[]> {
  const response = await api.get<any[]>('/posts/scheduled/calendar');
  return response.data;
}

export async function generateBulkPosts(data: {
  count: number;
  topic?: string;
  tone?: string;
  maxWords?: number;
}): Promise<{ message: string; posts: Post[]; count: number }> {
  const response = await api.post<{ message: string; posts: Post[]; count: number }>(
    '/posts/generate-bulk',
    data
  );
  return response.data;
}
