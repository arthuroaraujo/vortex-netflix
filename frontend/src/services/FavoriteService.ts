import api from './api';

export interface Favorite {
  id: number;
  imdbId: string;
  title: string;
  poster?: string;
  year?: string;
  createdAt: string;
}

export interface CreateFavoriteData {
  imdbId: string;
  title: string;
  poster?: string;
  year?: string;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await api.get<Favorite[]>('/favorites');

  return response.data;
}

export async function addFavorite(
  data: CreateFavoriteData,
): Promise<Favorite> {
  const response = await api.post<Favorite>(
    '/favorites',
    data,
  );

  return response.data;
}

export async function removeFavorite(
  imdbId: string,
): Promise<void> {
  await api.delete(`/favorites/${imdbId}`);
}