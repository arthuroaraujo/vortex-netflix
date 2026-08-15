import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: 'Token não informado',
    });
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: 'JWT_SECRET não configurado',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      secret,
    ) as TokenPayload;

    req.userId = decoded.userId;

    return next();
  } catch {
    return res.status(401).json({
      message: 'Token inválido ou expirado',
    });
  }
}