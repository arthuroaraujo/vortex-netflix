<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/FavoriteService";

import { useAuthStore } from "../stores/auth";

import {
  getMovieById,
  type MovieDetails,
} from "../services/MovieService";

const route = useRoute();
const router = useRouter();

const movie = ref<MovieDetails | null>(null);
const loading = ref(true);
const error = ref("");

const authStore = useAuthStore();

const isFavorite = ref(false);
const favoriteLoading = ref(false);

const showRemoveDialog = ref(false);

async function loadMovie() {
  const imdbId = route.params.imdbId;

  if (typeof imdbId !== "string") {
    error.value = "Filme não encontrado.";
    loading.value = false;
    return;
  }

  try {
    movie.value = await getMovieById(imdbId);
  } catch {
    error.value =
      "Não foi possível carregar os detalhes do filme.";
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}

async function checkFavorite(imdbId: string) {
  if (!authStore.isAuthenticated) {
    return;
  }

  try {
    const favorites = await getFavorites();

    isFavorite.value = favorites.some(
      (favorite) => favorite.imdbId === imdbId,
    );
  } catch {
    isFavorite.value = false;
  }
}

async function addMovieToFavorites() {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  if (!movie.value) {
    return;
  }

  favoriteLoading.value = true;

  try {
    await addFavorite({
      imdbId: movie.value.imdbID,
      title: movie.value.Title,
      poster: movie.value.Poster,
      year: movie.value.Year,
    });

    isFavorite.value = true;
  } catch (err: any) {
    console.error(err);
  } finally {
    favoriteLoading.value = false;
  }
}

function openRemoveDialog() {
  showRemoveDialog.value = true;
}

function cancelRemove() {
  showRemoveDialog.value = false;
}

async function confirmRemove() {
  if (!movie.value) {
    return;
  }

  favoriteLoading.value = true;

  try {
    await removeFavorite(movie.value.imdbID);

    isFavorite.value = false;
    showRemoveDialog.value = false;
  } catch (err: any) {
    console.error(err);
  } finally {
    favoriteLoading.value = false;
  }
}

onMounted(async () => {
  await loadMovie();

  if (movie.value) {
    await checkFavorite(movie.value.imdbID);
  }
});
</script>

<template>
  <v-container class="py-8">
    <!-- Voltar -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      Voltar
    </v-btn>

    <!-- Loading -->
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

    <!-- Erro -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
    >
      {{ error }}
    </v-alert>

    <!-- Filme -->
    <v-row
      v-else-if="movie"
      align="start"
    >
      <!-- Poster -->
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

      <!-- Informações -->
      <v-col
        cols="12"
        md="8"
        lg="9"
      >
        <div>
          <h1
            class="text-h3 font-weight-bold mb-3"
          >
            {{ movie.Title }}
          </h1>

          <!-- Informações básicas -->
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

          <!-- Favorito -->
          <div class="mt-4">
            <v-btn
              v-if="!isFavorite"
              color="primary"
              size="large"
              :loading="favoriteLoading"
              prepend-icon="mdi-heart-outline"
              @click="addMovieToFavorites"
            >
              Adicionar à minha lista
            </v-btn>

            <v-btn
              v-else
              color="primary"
              size="large"
              :loading="favoriteLoading"
              prepend-icon="mdi-heart"
              @click="openRemoveDialog"
            >
              Remover da minha lista
            </v-btn>
          </div>
        </div>

        <!-- Sinopse -->
        <v-card
          variant="tonal"
          class="mt-8 mb-6"
        >
          <v-card-title>
            Sinopse
          </v-card-title>

          <v-card-text class="text-body-1">
            {{ movie.Plot }}
          </v-card-text>
        </v-card>

        <!-- Informações adicionais -->
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

    <!-- Dialog de confirmação -->
    <v-dialog
      v-model="showRemoveDialog"
      max-width="480"
    >
      <v-card>
        <v-card-title
          class="text-h6 font-weight-bold"
        >
          Remover da minha lista?
        </v-card-title>

        <v-card-text>
          Tem certeza que deseja remover
          <strong>
            {{ movie?.Title }}
          </strong>
          da sua lista?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            variant="text"
            :disabled="favoriteLoading"
            @click="cancelRemove"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="favoriteLoading"
            @click="confirmRemove"
          >
            Remover
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>