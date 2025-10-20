import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentService.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, startDate, endDate } = req.query;
    const appointments = await getAppointments(req.userId!, {
      type: type as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      ...req.body,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    };
    const appointment = await createAppointment(req.userId!, data);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointment = await getAppointmentById(req.userId!, req.params.id);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    if (data.startTime) data.startTime = new Date(data.startTime);
    if (data.endTime) data.endTime = new Date(data.endTime);

    const appointment = await updateAppointment(req.userId!, req.params.id, data);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteAppointment(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
