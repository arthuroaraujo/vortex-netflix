<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  getMovieById,
  type MovieDetails,
} from '../services/MovieService';

const route = useRoute();
const router = useRouter();

const movie = ref<MovieDetails | null>(null);
const loading = ref(true);
const error = ref('');

async function loadMovie() {
  const imdbId = route.params.imdbId;

  if (typeof imdbId !== 'string') {
    error.value = 'Filme não encontrado.';
    loading.value = false;
    return;
  }

  try {
    movie.value = await getMovieById(imdbId);
  } catch {
    error.value =
      'Não foi possível carregar os detalhes do filme.';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}

onMounted(loadMovie);
</script>

<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      Voltar
    </v-btn>

    <div
      v-if="loading"
      class="d-flex justify-center py-16"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
    >
      {{ error }}
    </v-alert>

    <v-row
      v-else-if="movie"
      align="start"
    >
      <v-col
        cols="12"
        md="4"
        lg="3"
      >
        <v-img
          :src="movie.Poster"
          :alt="movie.Title"
          aspect-ratio="2 / 3"
          cover
          rounded
        >
          <template #error>
            <div
              class="d-flex align-center justify-center fill-height"
            >
              <v-icon size="64">
                mdi-movie-open-outline
              </v-icon>
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col
        cols="12"
        md="8"
        lg="9"
      >
        <div class="mb-6">
          <h1 class="text-h3 font-weight-bold mb-3">
            {{ movie.Title }}
          </h1>

          <div class="d-flex flex-wrap ga-2">
            <v-chip>
              {{ movie.Year }}
            </v-chip>

            <v-chip>
              {{ movie.Runtime }}
            </v-chip>

            <v-chip>
              {{ movie.Genre }}
            </v-chip>

            <v-chip
              v-if="movie.imdbRating !== 'N/A'"
              color="primary"
            >
              ⭐ {{ movie.imdbRating }}
            </v-chip>
          </div>
        </div>

        <v-card
          variant="tonal"
          class="mb-6"
        >
          <v-card-title>
            Sinopse
          </v-card-title>

          <v-card-text class="text-body-1">
            {{ movie.Plot }}
          </v-card-text>
        </v-card>

        <v-list lines="two">
          <v-list-item
            title="Diretor"
            :subtitle="movie.Director"
          />

          <v-list-item
            title="Elenco"
            :subtitle="movie.Actors"
          />

          <v-list-item
            title="Roteiro"
            :subtitle="movie.Writer"
          />

          <v-list-item
            title="Idioma"
            :subtitle="movie.Language"
          />

          <v-list-item
            title="País"
            :subtitle="movie.Country"
          />

          <v-list-item
            title="Prêmios"
            :subtitle="movie.Awards"
          />
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>