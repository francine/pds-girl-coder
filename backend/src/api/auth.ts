import { Router, Request, Response, NextFunction } from 'express';
import { register, login, refreshAccessToken, getUserProfile } from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, timezone } = req.body;
    const result = await register(email, password, name, timezone);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const accessToken = await refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserProfile(req.userId!);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
