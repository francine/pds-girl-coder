import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createJobOpportunity,
  getJobOpportunities,
  getJobOpportunityById,
  updateJobOpportunity,
  updateJobStage,
  deleteJobOpportunity,
} from '../services/jobOpportunityService.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stage } = req.query;
    const opportunities = await getJobOpportunities(req.userId!, {
      stage: stage as string,
    });
    res.json(opportunities);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunity = await createJobOpportunity(req.userId!, req.body);
    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunity = await getJobOpportunityById(req.userId!, req.params.id);
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunity = await updateJobOpportunity(
      req.userId!,
      req.params.id,
      req.body
    );
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/:id/stage',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stage, notes } = req.body;
      const opportunity = await updateJobStage(
        req.userId!,
        req.params.id,
        stage,
        notes
      );
      res.json(opportunity);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteJobOpportunity(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
