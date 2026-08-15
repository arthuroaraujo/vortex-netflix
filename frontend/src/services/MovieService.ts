import api from "./api";

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieRating {
  Source: string;
  Value: string;
}

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: MovieRating[];
  imdbRating: string;
  imdbID: string;
  Type: string;
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
  const response = await api.get<MovieSearchResponse>("/movies/search", {
    params: {
      title,
    },
  });

  return response.data;
}

export async function getMovieById(imdbId: string): Promise<MovieDetails> {
  const response = await api.get<MovieDetails>(`/movies/${imdbId}`);

  return response.data;
}
