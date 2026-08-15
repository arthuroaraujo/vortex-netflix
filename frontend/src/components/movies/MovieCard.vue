<script setup lang="ts">
import { useRouter } from "vue-router";

import type { Movie } from "../../services/MovieService";

defineProps<{
  movie: Movie;
}>();

const router = useRouter();

function viewDetails(imdbId: string) {
  router.push(`/movies/${imdbId}`);
}
</script>

<template>
  <v-card height="100%" class="movie-card">
    <v-img :src="movie.Poster" :alt="movie.Title" height="360" cover>
      <template #error>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon size="64"> mdi-movie-open-outline </v-icon>
        </div>
      </template>
    </v-img>

    <v-card-title>
      {{ movie.Title }}
    </v-card-title>

    <v-card-subtitle> {{ movie.Year }} · {{ movie.Type }} </v-card-subtitle>

    <v-card-actions>
      <v-btn variant="text" color="primary" @click="viewDetails(movie.imdbID)">
        Ver detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.movie-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
}
</style>
