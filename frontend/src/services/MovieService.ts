import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export async function searchMovies(
  title: string,
): Promise<MovieSearchResponse> {
  const response =
    await api.get<MovieSearchResponse>(
      '/movies/search',
      {
        params: {
          title,
        },
      },
    );

  return response.data;
}