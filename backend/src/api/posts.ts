import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  schedulePost,
  retryFailedPost,
  getWeeklyPostCount,
} from '../services/postService.js';
import { generateLinkedInPost } from '../integrations/claude.js';
import { generateMultiplePosts } from '../services/postGeneratorService.js';
import { getPostIdeaById } from '../services/postIdeaService.js';
import { getUserCollection } from '../models/User.js';
import { ObjectId } from 'mongodb';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, startDate, endDate } = req.query;
    const posts = await getPosts(req.userId!, {
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, postIdeaId, scheduledAt } = req.body;
    const post = await createPost(req.userId!, {
      content,
      postIdeaId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.get('/weekly-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await getWeeklyPostCount(req.userId!);
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// Get scheduled and published posts for calendar view
router.get('/scheduled/calendar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scheduledPosts = await getPosts(req.userId!, { status: 'scheduled' });
    const publishedPosts = await getPosts(req.userId!, { status: 'published' });
    const allPosts = [...scheduledPosts, ...publishedPosts];

    // Format for calendar
    const calendarEvents = allPosts
      .filter(post => post.scheduledAt || post.publishedAt)
      .map(post => ({
        _id: post._id,
        title: `LinkedIn Post: ${post.content.substring(0, 50)}...`,
        type: 'linkedin_post',
        startTime: post.scheduledAt || post.publishedAt,
        endTime: post.scheduledAt || post.publishedAt, // Posts are instant events
        description: post.content,
        postId: post._id,
        status: post.status
      }));

    res.json(calendarEvents);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await getPostById(req.userId!, req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, status, scheduledAt } = req.body;
    const post = await updatePost(req.userId!, req.params.id, {
      content,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePost(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/:id/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scheduledAt } = req.body;
    const post = await schedulePost(
      req.userId!,
      req.params.id,
      new Date(scheduledAt)
    );
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/retry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await retryFailedPost(req.userId!, req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postIdeaId, tone, maxWords } = req.body;

    // Get user for skills
    const users = getUserCollection();
    const user = await users.findOne({ _id: new ObjectId(req.userId!) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get post idea
    const postIdea = await getPostIdeaById(req.userId!, postIdeaId);

    // Generate content
    const content = await generateLinkedInPost(
      postIdea.title,
      postIdea.description,
      user.skills || [],
      tone || 'professional',
      maxWords || 300
    );

    res.json({ content });
  } catch (error) {
    return next(error);
  }
});

router.post('/generate-bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count, topic } = req.body;

    // Get user for skills
    const users = getUserCollection();
    const user = await users.findOne({ _id: new ObjectId(req.userId!) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSkills = user.skills || ['Software Engineering', 'Backend Development', 'Programming'];
    const postsToGenerate = Math.min(count || 5, 10); // Max 10 posts at once

    // Generate posts using templates (no API key needed!)
    const postContents = generateMultiplePosts(postsToGenerate, topic, userSkills);

    const generatedPosts = [];

    // Create posts in database
    for (const content of postContents) {
      try {
        const post = await createPost(req.userId!, {
          content,
          scheduledAt: undefined // Posts created as drafts
        });

        generatedPosts.push(post);
      } catch (error) {
        console.error('Failed to create post:', error);
        // Continue with other posts even if one fails
      }
    }

    res.json({
      message: `Successfully generated ${generatedPosts.length} posts`,
      posts: generatedPosts,
      count: generatedPosts.length
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
