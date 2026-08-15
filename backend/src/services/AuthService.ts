import bcrypt from 'bcrypt';

import prisma from '../lib/prisma.js';

interface RegisterData {
  name: string;
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
}