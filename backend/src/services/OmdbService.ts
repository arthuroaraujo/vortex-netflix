import axios from 'axios';

interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface OmdbSearchResponse {
  Search?: OmdbSearchResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface OmdbRating {
  Source: string;
  Value: string;
}

interface OmdbDetailsResponse {
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
  Ratings: OmdbRating[];
  imdbRating: string;
  imdbID: string;
  Type: string;
  Response: string;
  Error?: string;
}

export class OmdbService {
  private readonly baseUrl =
    'https://www.omdbapi.com';

  private get apiKey(): string {
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OMDB_API_KEY não configurada',
      );
    }

    return apiKey;
  }

  async search(title: string) {
    const response =
      await axios.get<OmdbSearchResponse>(
        this.baseUrl,
        {
          params: {
            apikey: this.apiKey,
            s: title,
          },
        },
      );

    if (response.data.Response === 'False') {
      throw new Error(
        response.data.Error ??
          'Nenhum título encontrado',
      );
    }

    return response.data;
  }

  async findById(imdbId: string) {
    const response =
      await axios.get<OmdbDetailsResponse>(
        this.baseUrl,
        {
          params: {
            apikey: this.apiKey,
            i: imdbId,
            plot: 'full',
          },
        },
      );

    if (response.data.Response === 'False') {
      throw new Error(
        response.data.Error ??
          'Título não encontrado',
      );
    }

    return response.data;
  }
}