<script setup lang="ts">
import { ref } from "vue";

import MovieCard from "../components/movies/MovieCard.vue";
import MovieCardSkeleton from "../components/movies/MovieCardSkeleton.vue";

import {
  searchMovies,
  getMovieById,
  type Movie,
} from "../services/MovieService";

const search = ref("");
const movies = ref<Movie[]>([]);
const featuredMovies = ref<Movie[]>([]);

const loading = ref(false);
const featuredLoading = ref(true);

const error = ref("");

const featuredMovieIds = [
  "tt0372784", // Batman Begins
  "tt0468569", // The Dark Knight
  "tt4154796", // Avengers: Endgame
  "tt1375666", // Inception
];

async function loadFeaturedMovies() {
  try {
    const results = await Promise.all(
      featuredMovieIds.map((imdbId) =>
        getMovieById(imdbId),
      ),
    );

    featuredMovies.value = results.map(
      (movie) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster,
      }),
    );
  } catch {
    featuredMovies.value = [];
  } finally {
    featuredLoading.value = false;
  }
}

async function handleSearch() {
  const title = search.value.trim();

  if (!title) {
    error.value =
      "Digite o nome de um filme ou série.";
    return;
  }

  loading.value = true;
  error.value = "";
  movies.value = [];

  try {
    const result = await searchMovies(title);

    movies.value = result.Search ?? [];

    if (movies.value.length === 0) {
      error.value =
        "Nenhum filme ou série encontrado.";
    }
  } catch {
    movies.value = [];
    error.value =
      "Não foi possível realizar a busca.";
  } finally {
    loading.value = false;
  }
}

loadFeaturedMovies();
</script>

<template>
  <v-container class="py-8">
    <!-- Cabeçalho -->
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">
        Flixter
      </h1>

      <p class="text-subtitle-1 text-medium-emphasis">
        Seu catálogo de filmes e séries
      </p>
    </div>

    <!-- Busca -->
    <v-form
      class="mb-10"
      @submit.prevent="handleSearch"
    >
      <v-row>
        <v-col
          cols="12"
          md="9"
        >
          <v-text-field
            v-model="search"
            label="Buscar filme ou série"
            placeholder="Ex: Batman"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            height="56"
            :loading="loading"
          >
            Buscar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- Erro -->
    <v-alert
      v-if="error"
      type="warning"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}
    </v-alert>

    <!-- Filmes em destaque -->
    <template
      v-if="
        movies.length === 0 &&
        !error
      "
    >
      <div class="mb-6">
        <h2
          class="text-h5 font-weight-bold mb-2"
        >
          Filmes em destaque
        </h2>

        <p
          class="text-body-2 text-medium-emphasis"
        >
          Confira alguns filmes selecionados
          para você.
        </p>
      </div>

      <!-- Skeleton dos destaques -->
      <v-row v-if="featuredLoading">
        <v-col
          v-for="index in 4"
          :key="`featured-skeleton-${index}`"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <MovieCardSkeleton />
        </v-col>
      </v-row>

      <!-- Destaques carregados -->
      <v-row v-else>
        <v-col
          v-for="movie in featuredMovies"
          :key="movie.imdbID"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <MovieCard :movie="movie" />
        </v-col>
      </v-row>
    </template>

    <!-- Carregando resultados da busca -->
    <template v-if="loading">
      <div class="mb-6">
        <h2 class="text-h5 font-weight-bold">
          Buscando filmes...
        </h2>
      </div>

      <v-row>
        <v-col
          v-for="index in 8"
          :key="`search-skeleton-${index}`"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <MovieCardSkeleton />
        </v-col>
      </v-row>
    </template>

    <!-- Resultados da busca -->
    <template
      v-else-if="movies.length > 0"
    >
      <div class="mb-6">
        <h2 class="text-h5 font-weight-bold">
          Resultados da busca
        </h2>
      </div>

      <v-row>
        <v-col
          v-for="movie in movies"
          :key="movie.imdbID"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <MovieCard :movie="movie" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>