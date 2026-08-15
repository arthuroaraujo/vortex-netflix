import prisma from '../lib/prisma.js';

interface CreateFavoriteData {
  userId: number;
  imdbId: string;
  title: string;
  poster?: string;
  year?: string;
}

export class FavoriteService {
  async create(data: CreateFavoriteData) {
    const existingFavorite =
      await prisma.favorite.findUnique({
        where: {
          userId_imdbId: {
            userId: data.userId,
            imdbId: data.imdbId,
          },
        },
      });

    if (existingFavorite) {
      throw new Error(
        'Este título já está na sua lista',
      );
    }

    return prisma.favorite.create({
      data: {
        userId: data.userId,
        imdbId: data.imdbId,
        title: data.title,
        poster: data.poster,
        year: data.year,
      },
    });
  }

  async findAllByUser(userId: number) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(
    userId: number,
    imdbId: string,
  ) {
    const favorite =
      await prisma.favorite.findUnique({
        where: {
          userId_imdbId: {
            userId,
            imdbId,
          },
        },
      });

    if (!favorite) {
      throw new Error(
        'Título não encontrado na sua lista',
      );
    }

    return prisma.favorite.delete({
      where: {
        userId_imdbId: {
          userId,
          imdbId,
        },
      },
    });
  }
}