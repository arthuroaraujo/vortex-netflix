import { Request, Response } from "express";

import { FavoriteService } from "../services/FavoriteService.js";

const favoriteService = new FavoriteService();

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export class FavoriteController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Não autenticado",
        });
      }

      const { imdbId, title, poster, year } = req.body;

      if (!imdbId || !title) {
        return res.status(400).json({
          message: "imdbId e title são obrigatórios",
        });
      }

      const favorite = await favoriteService.create({
        userId,
        imdbId,
        title,
        poster,
        year,
      });

      return res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Este título já está na sua lista") {
          return res.status(409).json({
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Não autenticado",
        });
      }

      const favorites = await favoriteService.findAllByUser(userId);

      return res.status(200).json(favorites);
    } catch {
      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async remove(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Não autenticado",
        });
      }

      const { imdbId } = req.params;

      if (!imdbId || Array.isArray(imdbId)) {
        return res.status(400).json({
          message: "imdbId é obrigatório",
        });
      }

      await favoriteService.remove(userId, imdbId);

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Título não encontrado na sua lista") {
          return res.status(404).json({
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }
}
