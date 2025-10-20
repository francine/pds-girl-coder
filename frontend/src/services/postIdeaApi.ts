import api from './api';
import { PostIdea } from '../types/api';

export async function getPostIdeas(filters?: {
  status?: string;
  tag?: string;
}): Promise<PostIdea[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.tag) params.append('tag', filters.tag);

  const response = await api.get<PostIdea[]>(
    `/post-ideas${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
}

export async function getPostIdeaById(id: string): Promise<PostIdea> {
  const response = await api.get<PostIdea>(`/post-ideas/${id}`);
  return response.data;
}

export async function createPostIdea(data: {
  title: string;
  description: string;
  tags?: string[];
}): Promise<PostIdea> {
  const response = await api.post<PostIdea>('/post-ideas', data);
  return response.data;
}

export async function updatePostIdea(
  id: string,
  data: {
    title?: string;
    description?: string;
    tags?: string[];
    status?: 'active' | 'used' | 'archived';
  }
): Promise<PostIdea> {
  const response = await api.put<PostIdea>(`/post-ideas/${id}`, data);
  return response.data;
}

export async function deletePostIdea(id: string): Promise<void> {
  await api.delete(`/post-ideas/${id}`);
}

export async function generatePostIdeas(
  count?: number
): Promise<{
  ideas: Array<{ title: string; description: string; reason: string }>;
}> {
  const response = await api.post<{
    ideas: Array<{ title: string; description: string; reason: string }>;
  }>('/post-ideas/generate-ideas', { count });
  return response.data;
}
