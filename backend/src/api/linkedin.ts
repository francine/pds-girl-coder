import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  initiateLinkedInAuth,
  handleLinkedInCallback,
  disconnectLinkedIn,
} from '../services/linkedinService.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Initiate LinkedIn OAuth flow
router.get('/auth', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUrl = initiateLinkedInAuth(req.userId!);
    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
});

// Handle LinkedIn OAuth callback
router.get(
  '/callback',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query;
      const result = await handleLinkedInCallback(
        code as string,
        state as string
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Disconnect LinkedIn
router.post(
  '/disconnect',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await disconnectLinkedIn(req.userId!);
      res.json({ message: 'LinkedIn disconnected successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
