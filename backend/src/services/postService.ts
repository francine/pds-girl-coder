import { ObjectId } from 'mongodb';
import { getPostCollection, Post } from '../models/Post.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { validateStringLength } from '../utils/validation.js';
import { startOfWeek } from '../utils/dateUtils.js';
import { markPostIdeaAsUsed } from './postIdeaService.js';

export async function createPost(
  userId: string,
  data: {
    content: string;
    postIdeaId?: string;
    scheduledAt?: Date;
  }
): Promise<Post> {
  // Validation
  const contentValidation = validateStringLength(data.content, 1, 3000);
  if (!contentValidation.valid) {
    throw new ValidationError(`Content ${contentValidation.error}`);
  }

  const now = new Date();
  const post: Post = {
    userId: new ObjectId(userId),
    ...(data.postIdeaId && { postIdeaId: new ObjectId(data.postIdeaId) }),
    content: data.content,
    status: data.scheduledAt ? 'scheduled' : 'draft',
    scheduledAt: data.scheduledAt,
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const collection = getPostCollection();
  const result = await collection.insertOne(post);

  // Mark post idea as used if linked
  if (data.postIdeaId) {
    await markPostIdeaAsUsed(userId, data.postIdeaId, result.insertedId.toString());
  }

  return { ...post, _id: result.insertedId };
}

export async function getPosts(
  userId: string,
  filters?: { status?: string; startDate?: Date; endDate?: Date }
): Promise<Post[]> {
  const collection = getPostCollection();
  const query: any = { userId: new ObjectId(userId) };

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.createdAt.$lte = filters.endDate;
    }
  }

  return collection.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getPostById(
  userId: string,
  postId: string
): Promise<Post> {
  const collection = getPostCollection();
  const post = await collection.findOne({
    _id: new ObjectId(postId),
    userId: new ObjectId(userId),
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  return post;
}

export async function updatePost(
  userId: string,
  postId: string,
  data: {
    content?: string;
    status?: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduledAt?: Date;
  }
): Promise<Post> {
  // Validation
  if (data.content) {
    const contentValidation = validateStringLength(data.content, 1, 3000);
    if (!contentValidation.valid) {
      throw new ValidationError(`Content ${contentValidation.error}`);
    }
  }

  const collection = getPostCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(postId), userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new NotFoundError('Post not found');
  }

  return result;
}

export async function deletePost(
  userId: string,
  postId: string
): Promise<void> {
  const collection = getPostCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(postId),
    userId: new ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Post not found');
  }
}

export async function schedulePost(
  userId: string,
  postId: string,
  scheduledAt: Date
): Promise<Post> {
  return updatePost(userId, postId, {
    status: 'scheduled',
    scheduledAt,
  });
}

export async function getWeeklyPostCount(userId: string): Promise<number> {
  const collection = getPostCollection();
  const weekStart = startOfWeek();

  return collection.countDocuments({
    userId: new ObjectId(userId),
    createdAt: { $gte: weekStart },
    status: { $in: ['scheduled', 'published'] },
  });
}

// Placeholder for LinkedIn publishing - will be implemented with LinkedIn integration
export async function publishPostToLinkedIn(postId: string): Promise<Post> {
  const collection = getPostCollection();
  const post = await collection.findOne({ _id: new ObjectId(postId) });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  // TODO: Implement actual LinkedIn API call
  // For now, just mark as published
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(postId) },
    {
      $set: {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result!;
}

export async function retryFailedPost(
  userId: string,
  postId: string
): Promise<Post> {
  const post = await getPostById(userId, postId);

  if (post.status !== 'failed') {
    throw new ValidationError('Only failed posts can be retried');
  }

  if (post.retryCount >= 3) {
    throw new ValidationError('Maximum retry attempts reached');
  }

  // Reset to scheduled status for retry
  return updatePost(userId, postId, {
    status: 'scheduled',
  });
}
