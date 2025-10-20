import { ObjectId, Collection } from 'mongodb';
import { getDB } from '../config/database.js';

export interface PostMetrics {
  likes: number;
  comments: number;
  shares: number;
  lastUpdated?: Date;
}

export interface Post {
  _id?: ObjectId;
  userId: ObjectId;
  postIdeaId?: ObjectId;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: Date;
  publishedAt?: Date;
  linkedinPostId?: string;
  linkedinUrl?: string;
  metrics: PostMetrics;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export function getPostCollection(): Collection<Post> {
  return getDB().collection<Post>('posts');
}

export async function createPostIndexes(): Promise<void> {
  const collection = getPostCollection();
  await collection.createIndex({ userId: 1, status: 1 });
  await collection.createIndex({ userId: 1, scheduledAt: 1 });
  await collection.createIndex({ userId: 1, createdAt: -1 });
  await collection.createIndex({ scheduledAt: 1 });
}
