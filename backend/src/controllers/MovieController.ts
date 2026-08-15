import { Request, Response } from 'express';

import {
  OmdbError,
  OmdbService,
} from '../services/OmdbService.js';

const omdbService = new OmdbService();

export class MovieController {
  async search(
    req: Request,
    res: Response,
  ) {
    try {
      const title = req.query.title;

      if (
        typeof title !== 'string' ||
        !title.trim()
      ) {
        return res.status(400).json({
          message:
            'O parâmetro title é obrigatório',
        });
      }

      const result = await omdbService.search(
        title.trim(),
      );

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof OmdbError) {
        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }

  async findById(
    req: Request<{ imdbId: string }>,
    res: Response,
  ) {
    try {
      const { imdbId } = req.params;

      const result =
        await omdbService.findById(imdbId);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof OmdbError) {
        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }
}