import express from 'express';
const router = express.Router();

import { authUser, registerUser } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddlewares.js';

router.post('/', authUser);
router.post('/register', registerUser);

export default router;
