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

export class OmdbError extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {
    super(message);

    this.name = 'OmdbError';
    this.statusCode = statusCode;
  }
}

export class OmdbService {
  private readonly baseUrl =
    'https://www.omdbapi.com';

  private get apiKey(): string {
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      throw new OmdbError(
        'OMDB_API_KEY não configurada',
        500,
      );
    }

    return apiKey;
  }

  async search(title: string) {
    try {
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
        throw new OmdbError(
          response.data.Error ??
            'Nenhum título encontrado',
          404,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof OmdbError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new OmdbError(
            'Chave da OMDb inválida ou não autorizada',
            502,
          );
        }

        throw new OmdbError(
          'Erro ao consultar a OMDb API',
          502,
        );
      }

      throw error;
    }
  }

  async findById(imdbId: string) {
    try {
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
        throw new OmdbError(
          response.data.Error ??
            'Título não encontrado',
          404,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof OmdbError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new OmdbError(
            'Chave da OMDb inválida ou não autorizada',
            502,
          );
        }

        throw new OmdbError(
          'Erro ao consultar a OMDb API',
          502,
        );
      }

      throw error;
    }
  }
}