import express from 'express';
import cors from 'cors';
import favoriteRoutes from './routes/favorite.routes.js';

import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'Voxter Netflix API is running',
  });
});

app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/favorites', favoriteRoutes);

export default app;