<script setup lang="ts">
import { ref } from 'vue';

import MovieCard from '../components/movies/MovieCard.vue';

import {
  searchMovies,
  type Movie,
} from '../services/MovieService';

const search = ref('');
const movies = ref<Movie[]>([]);
const loading = ref(false);
const error = ref('');

async function handleSearch() {
  const title = search.value.trim();

  if (!title) {
    error.value =
      'Digite o nome de um filme ou série.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = await searchMovies(title);

    movies.value = result.Search ?? [];

    if (movies.value.length === 0) {
      error.value =
        'Nenhum filme ou série encontrado.';
    }
  } catch {
    movies.value = [];
    error.value =
      'Não foi possível realizar a busca.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container
    class="py-8"
  >
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">
        Voxter
      </h1>

      <p class="text-subtitle-1 text-medium-emphasis">
        Seu catálogo de filmes e séries
      </p>
    </div>

    <v-form
      class="mb-8"
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

    <v-alert
      v-if="error"
      type="warning"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}
    </v-alert>

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
  </v-container>
</template>