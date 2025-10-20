import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createRecruiter,
  getRecruiters,
  getRecruiterById,
  updateRecruiter,
  updateRecruiterStatus,
  deleteRecruiter,
  getWeeklyConnectionCount,
  generateRecruiterMessages,
} from '../services/recruiterService.js';
import { generateMultipleSearchUrls } from '../services/linkedinSearchService.js';
import { getUserCollection } from '../models/User.js';
import { ObjectId } from 'mongodb';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const recruiters = await getRecruiters(req.userId!, {
      status: status as string,
    });
    res.json(recruiters);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recruiter = await createRecruiter(req.userId!, req.body);
    res.status(201).json(recruiter);
  } catch (error) {
    next(error);
  }
});

router.get('/weekly-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await getWeeklyConnectionCount(req.userId!);
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recruiter = await getRecruiterById(req.userId!, req.params.id);
    res.json(recruiter);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recruiter = await updateRecruiter(req.userId!, req.params.id, req.body);
    res.json(recruiter);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/:id/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, notes } = req.body;
      const recruiter = await updateRecruiterStatus(
        req.userId!,
        req.params.id,
        status,
        notes
      );
      res.json(recruiter);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteRecruiter(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Generate LinkedIn search URLs for finding recruiters
router.get('/search/linkedin-urls', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = getUserCollection();
    const user = await users.findOne({ _id: new ObjectId(req.userId!) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const searchUrls = generateMultipleSearchUrls({
      skills: user.skills || ['Software Engineering'],
      location: user.targetRegions && user.targetRegions.length > 0 ? user.targetRegions[0] : undefined,
      targetCompanies: []
    });

    res.json({ searchUrls });
  } catch (error) {
    next(error);
  }
});

// Generate contact messages for a specific recruiter
router.post('/:id/generate-messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = getUserCollection();
    const user = await users.findOne({ _id: new ObjectId(req.userId!) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { language } = req.body;

    const recruiter = await generateRecruiterMessages(
      req.userId!,
      req.params.id,
      {
        userSkills: user.skills || [],
        userExperience: user.bio || '',
        language: language || 'en'
      }
    );

    res.json(recruiter);
  } catch (error) {
    next(error);
  }
});

export default router;
