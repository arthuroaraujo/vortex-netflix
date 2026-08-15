import { Request, Response } from 'express';

import { registerSchema } from '../schemas/auth.schema.js';
import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export class AuthController {
  async register(
    req: Request,
    res: Response,
  ) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await authService.register(data);

      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }
}