import { ObjectId, Collection } from 'mongodb';
import { getDB } from '../config/database.js';

export interface PostIdea {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description: string;
  tags: string[];
  status: 'active' | 'used' | 'archived';
  usedInPostIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export function getPostIdeaCollection(): Collection<PostIdea> {
  return getDB().collection<PostIdea>('postIdeas');
}

export async function createPostIdeaIndexes(): Promise<void> {
  const collection = getPostIdeaCollection();
  await collection.createIndex({ userId: 1, status: 1 });
  await collection.createIndex({ userId: 1, createdAt: -1 });
}
