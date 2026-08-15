<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import {
  getFavorites,
  removeFavorite,
  type Favorite,
} from "../services/FavoriteService";

const router = useRouter();

const favorites = ref<Favorite[]>([]);
const loading = ref(true);
const error = ref("");

const removingId = ref<string | null>(null);

const showDeleteDialog = ref(false);
const favoriteToRemove = ref<Favorite | null>(null);

async function loadFavorites() {
  loading.value = true;
  error.value = "";

  try {
    favorites.value = await getFavorites();
  } catch (err: any) {
    error.value =
      err.response?.data?.message ?? "Não foi possível carregar sua lista.";
  } finally {
    loading.value = false;
  }
}

function openMovie(imdbId: string) {
  router.push(`/movies/${imdbId}`);
}

function goToCatalog() {
  router.push("/");
}

function confirmRemove(favorite: Favorite) {
  favoriteToRemove.value = favorite;
  showDeleteDialog.value = true;
}

function cancelRemove() {
  showDeleteDialog.value = false;
  favoriteToRemove.value = null;
}

async function handleRemove() {
  if (!favoriteToRemove.value) {
    return;
  }

  const imdbId = favoriteToRemove.value.imdbId;

  removingId.value = imdbId;
  error.value = "";

  try {
    await removeFavorite(imdbId);

    favorites.value = favorites.value.filter(
      (favorite) => favorite.imdbId !== imdbId,
    );

    showDeleteDialog.value = false;
    favoriteToRemove.value = null;
  } catch (err: any) {
    error.value =
      err.response?.data?.message ?? "Não foi possível remover o filme.";
  } finally {
    removingId.value = null;
  }
}

onMounted(loadFavorites);
</script>

<template>
  <v-container class="py-8">
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold mb-2">Minha Lista</h1>

      <p class="text-medium-emphasis">Seus filmes e séries favoritos</p>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
      {{ error }}
    </v-alert>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Lista vazia -->
    <div
      v-else-if="favorites.length === 0"
      class="empty-state text-center py-16"
    >
      <v-icon size="72" color="primary" class="mb-6">
        mdi-heart-outline
      </v-icon>

      <h2 class="text-h5 font-weight-bold mb-3">Sua lista está vazia</h2>

      <p class="text-body-1 text-medium-emphasis mb-6">
        Adicione filmes e séries aos seus favoritos para encontrá-los aqui
        depois.
      </p>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-movie-search-outline"
        @click="goToCatalog"
      >
        Explorar filmes
      </v-btn>
    </div>

    <!-- Lista de favoritos -->
    <v-row v-else>
      <v-col
        v-for="favorite in favorites"
        :key="favorite.imdbId"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          height="100%"
          class="favorite-card d-flex flex-column"
          hover
          @click="openMovie(favorite.imdbId)"
        >
          <v-img
            :src="favorite.poster"
            :alt="favorite.title"
            height="360"
            cover
          >
            <template #error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="64"> mdi-movie-open-outline </v-icon>
              </div>
            </template>
          </v-img>

          <v-card-title>
            {{ favorite.title }}
          </v-card-title>

          <v-card-subtitle>
            {{ favorite.year || "Ano não informado" }}
          </v-card-subtitle>

          <v-spacer />

          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click.stop="openMovie(favorite.imdbId)"
            >
              Ver detalhes
            </v-btn>

            <v-spacer />

            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              color="error"
              :loading="removingId === favorite.imdbId"
              :disabled="removingId !== null && removingId !== favorite.imdbId"
              aria-label="Remover dos favoritos"
              @click.stop="confirmRemove(favorite)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirmação de remoção -->
    <v-dialog v-model="showDeleteDialog" max-width="480">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Remover da minha lista?
        </v-card-title>

        <v-card-text>
          Tem certeza que deseja remover
          <strong>
            {{ favoriteToRemove?.title }}
          </strong>
          da sua lista?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            variant="text"
            :disabled="removingId !== null"
            @click="cancelRemove"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="removingId !== null"
            @click="handleRemove"
          >
            Remover
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.favorite-card {
  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-4px);
}

.empty-state {
  max-width: 560px;
  margin: 0 auto;
}
</style>
