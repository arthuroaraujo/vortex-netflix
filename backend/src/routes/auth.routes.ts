import { Router } from 'express';

import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authController = new AuthController();

const router = Router();

router.post(
  '/register',
  (req, res) =>
    authController.register(req, res),
);

router.post(
  '/login',
  (req, res) =>
    authController.login(req, res),
);

router.get(
  '/me',
  authMiddleware,
  (req, res) => {
    return res.status(200).json({
      userId: req.userId,
    });
  },
);

export default router;