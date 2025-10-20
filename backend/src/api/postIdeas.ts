import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createPostIdea,
  getPostIdeas,
  getPostIdeaById,
  updatePostIdea,
  deletePostIdea,
} from '../services/postIdeaService.js';
import { generatePostIdeas } from '../integrations/claude.js';
import { getUserCollection } from '../models/User.js';
import { ObjectId } from 'mongodb';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, tag } = req.query;
    const postIdeas = await getPostIdeas(req.userId!, {
      status: status as string,
      tag: tag as string,
    });
    res.json(postIdeas);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, tags } = req.body;
    const postIdea = await createPostIdea(req.userId!, {
      title,
      description,
      tags,
    });
    res.status(201).json(postIdea);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postIdea = await getPostIdeaById(req.userId!, req.params.id);
    res.json(postIdea);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, tags, status } = req.body;
    const postIdea = await updatePostIdea(req.userId!, req.params.id, {
      title,
      description,
      tags,
      status,
    });
    res.json(postIdea);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePostIdea(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/generate-ideas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count } = req.body;

    // Get user for skills
    const users = getUserCollection();
    const user = await users.findOne({ _id: new ObjectId(req.userId!) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate ideas
    const ideas = await generatePostIdeas(user.skills || [], count || 5);

    res.json({ ideas });
  } catch (error) {
    return next(error);
  }
});

export default router;
