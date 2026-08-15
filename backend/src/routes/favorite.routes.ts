import { Router } from 'express';

import { FavoriteController } from '../controllers/FavoriteController.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

const favoriteController =
  new FavoriteController();

router.post(
  '/',
  authMiddleware,
  (req, res) =>
    favoriteController.create(req, res),
);

router.get(
  '/',
  authMiddleware,
  (req, res) =>
    favoriteController.findAll(req, res),
);

router.delete(
  '/:imdbId',
  authMiddleware,
  (req, res) =>
    favoriteController.remove(req, res),
);

export default router;