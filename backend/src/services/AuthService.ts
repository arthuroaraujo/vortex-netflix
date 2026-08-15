import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../lib/prisma.js';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register({
    name,
    email,
    password,
  }: RegisterData) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(
      password,
      10,
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login({
    email,
    password,
  }: LoginData) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('E-mail ou senha inválidos');
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new Error('E-mail ou senha inválidos');
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      {
        expiresIn: '1d',
      },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}