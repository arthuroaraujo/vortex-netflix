import { Router } from 'express';

import { MovieController } from '../controllers/MovieController.js';

const movieController = new MovieController();

const router = Router();

router.get(
  '/search',
  (req, res) =>
    movieController.search(req, res),
);

router.get(
  '/:imdbId',
  (req, res) =>
    movieController.findById(req, res),
);

export default router;