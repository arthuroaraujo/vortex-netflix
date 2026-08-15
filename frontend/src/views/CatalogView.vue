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
const featuredSeries = ref<Movie[]>([]);

const loading = ref(false);
const featuredLoading = ref(true);

const error = ref("");

const featuredMovieIds = [
  "tt0372784", // Batman Begins
  "tt0468569", // The Dark Knight
  "tt4154796", // Avengers: Endgame
  "tt1375666", // Inception
];

const featuredSeriesIds = [
  "tt0903747", // Breaking Bad
  "tt0944947", // Game of Thrones
  "tt1475582", // Sherlock
  "tt2861424", // Rick and Morty
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
  }
}

async function loadFeaturedSeries() {
  try {
    const results = await Promise.all(
      featuredSeriesIds.map((imdbId) =>
        getMovieById(imdbId),
      ),
    );

    featuredSeries.value = results.map(
      (movie) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster,
      }),
    );
  } catch {
    featuredSeries.value = [];
  }
}

async function loadFeaturedContent() {
  try {
    await Promise.all([
      loadFeaturedMovies(),
      loadFeaturedSeries(),
    ]);
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

function clearSearch() {
  search.value = "";
  movies.value = [];
  error.value = "";
}

loadFeaturedContent();
</script>

<template>
  <v-container class="py-8">
    <!-- Hero -->
    <section class="hero-section mb-12">
      <div class="hero-content text-center">
        <v-icon
          size="48"
          color="primary"
          class="mb-4"
        >
          mdi-movie-open-outline
        </v-icon>

        <h1
          class="text-h3 text-md-h2 font-weight-bold mb-4"
        >
          Encontre seu próximo filme
        </h1>

        <p
          class="text-subtitle-1 text-medium-emphasis mx-auto mb-8"
        >
          Explore filmes e séries, descubra novos
          títulos e monte sua própria lista.
        </p>

        <!-- Busca -->
        <v-form
          @submit.prevent="handleSearch"
        >
          <v-row
            justify="center"
            class="search-row"
          >
            <v-col
              cols="12"
              md="8"
              lg="7"
            >
              <v-text-field
                v-model="search"
                label="Buscar filme ou série"
                placeholder="Ex: Batman"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                bg-color="surface"
                hide-details
              />
            </v-col>

            <v-col
              cols="12"
              md="3"
              lg="2"
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
      </div>
    </section>

    <!-- Erro -->
    <v-alert
      v-if="error"
      type="warning"
      variant="tonal"
      class="mb-8"
    >
      {{ error }}
    </v-alert>

    <!-- Busca em andamento -->
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

    <!-- Resultados -->
    <template
      v-else-if="movies.length > 0"
    >
      <div
        class="d-flex align-center justify-space-between mb-6"
      >
        <div>
          <h2
            class="text-h5 font-weight-bold"
          >
            Resultados da busca
          </h2>

          <p
            class="text-body-2 text-medium-emphasis mt-1"
          >
            Filmes e séries encontrados para
            "{{ search }}"
          </p>
        </div>

        <v-btn
          variant="text"
          prepend-icon="mdi-close"
          @click="clearSearch"
        >
          Limpar busca
        </v-btn>
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

    <!-- Conteúdo da Home -->
    <template
      v-else-if="
        movies.length === 0 &&
        !error
      "
    >
      <!-- Filmes -->
      <section class="mb-12">
        <div class="mb-6">
          <h2
            class="text-h5 font-weight-bold mb-2"
          >
            Filmes em destaque
          </h2>

          <p
            class="text-body-2 text-medium-emphasis"
          >
            Alguns filmes que vale a pena conhecer.
          </p>
        </div>

        <v-row v-if="featuredLoading">
          <v-col
            v-for="index in 4"
            :key="`movie-skeleton-${index}`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCardSkeleton />
          </v-col>
        </v-row>

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
      </section>

      <!-- Séries -->
      <section>
        <div class="mb-6">
          <h2
            class="text-h5 font-weight-bold mb-2"
          >
            Séries em destaque
          </h2>

          <p
            class="text-body-2 text-medium-emphasis"
          >
            Séries populares para você descobrir.
          </p>
        </div>

        <v-row v-if="featuredLoading">
          <v-col
            v-for="index in 4"
            :key="`series-skeleton-${index}`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCardSkeleton />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="movie in featuredSeries"
            :key="movie.imdbID"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCard :movie="movie" />
          </v-col>
        </v-row>
      </section>
    </template>
  </v-container>
</template>

<style scoped>
.hero-section {
  padding: 48px 24px;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at center,
      rgba(229, 9, 20, 0.12),
      transparent 65%
    );
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.search-row {
  max-width: 900px;
  margin: 0 auto;
}
</style>