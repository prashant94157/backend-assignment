import express from 'express';
const router = express.Router();

import {
  bookSlot,
  getBookedSlots,
  getSlots,
} from '../controllers/appointmentControllers.js';
import { protect, dean } from '../middlewares/authMiddlewares.js';

router.get('/', protect, getSlots);
router.get('/booked', protect, dean, getBookedSlots);
router.patch('/:id', protect, bookSlot);

export default router;
