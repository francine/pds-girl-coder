import { ObjectId } from 'mongodb';
import { getPostIdeaCollection, PostIdea } from '../models/PostIdea.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { validateStringLength } from '../utils/validation.js';

export async function createPostIdea(
  userId: string,
  data: {
    title: string;
    description: string;
    tags?: string[];
  }
): Promise<PostIdea> {
  // Validation
  const titleValidation = validateStringLength(data.title, 1, 200);
  if (!titleValidation.valid) {
    throw new ValidationError(`Title ${titleValidation.error}`);
  }

  if (data.description) {
    const descValidation = validateStringLength(data.description, 0, 2000);
    if (!descValidation.valid) {
      throw new ValidationError(`Description ${descValidation.error}`);
    }
  }

  if (data.tags && data.tags.length > 10) {
    throw new ValidationError('Maximum 10 tags allowed');
  }

  const now = new Date();
  const postIdea: PostIdea = {
    userId: new ObjectId(userId),
    title: data.title,
    description: data.description || '',
    tags: data.tags || [],
    status: 'active',
    usedInPostIds: [],
    createdAt: now,
    updatedAt: now,
  };

  const collection = getPostIdeaCollection();
  const result = await collection.insertOne(postIdea);

  return { ...postIdea, _id: result.insertedId };
}

export async function getPostIdeas(
  userId: string,
  filters?: { status?: string; tag?: string }
): Promise<PostIdea[]> {
  const collection = getPostIdeaCollection();
  const query: any = { userId: new ObjectId(userId) };

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.tag) {
    query.tags = filters.tag;
  }

  return collection.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getPostIdeaById(
  userId: string,
  postIdeaId: string
): Promise<PostIdea> {
  const collection = getPostIdeaCollection();
  const postIdea = await collection.findOne({
    _id: new ObjectId(postIdeaId),
    userId: new ObjectId(userId),
  });

  if (!postIdea) {
    throw new NotFoundError('Post idea not found');
  }

  return postIdea;
}

export async function updatePostIdea(
  userId: string,
  postIdeaId: string,
  data: {
    title?: string;
    description?: string;
    tags?: string[];
    status?: 'active' | 'used' | 'archived';
  }
): Promise<PostIdea> {
  // Validation
  if (data.title) {
    const titleValidation = validateStringLength(data.title, 1, 200);
    if (!titleValidation.valid) {
      throw new ValidationError(`Title ${titleValidation.error}`);
    }
  }

  if (data.description) {
    const descValidation = validateStringLength(data.description, 0, 2000);
    if (!descValidation.valid) {
      throw new ValidationError(`Description ${descValidation.error}`);
    }
  }

  if (data.tags && data.tags.length > 10) {
    throw new ValidationError('Maximum 10 tags allowed');
  }

  const collection = getPostIdeaCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(postIdeaId), userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Post idea not found');
  }

  return result;
}

export async function deletePostIdea(
  userId: string,
  postIdeaId: string
): Promise<void> {
  const collection = getPostIdeaCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(postIdeaId),
    userId: new ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Post idea not found');
  }
}

export async function markPostIdeaAsUsed(
  userId: string,
  postIdeaId: string,
  postId: string
): Promise<PostIdea> {
  const collection = getPostIdeaCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(postIdeaId), userId: new ObjectId(userId) },
    {
      $set: { status: 'used', updatedAt: new Date() },
      $addToSet: { usedInPostIds: new ObjectId(postId) },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Post idea not found');
  }

  return result;
}
