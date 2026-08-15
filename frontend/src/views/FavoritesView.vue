<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  getFavorites,
  removeFavorite,
  type Favorite,
} from '../services/FavoriteService';

const router = useRouter();

const favorites = ref<Favorite[]>([]);
const loading = ref(true);
const error = ref('');

async function loadFavorites() {
  loading.value = true;
  error.value = '';

  try {
    favorites.value = await getFavorites();
  } catch (err: any) {
    error.value =
      err.response?.data?.message ??
      'Não foi possível carregar sua lista.';
  } finally {
    loading.value = false;
  }
}

async function handleRemove(imdbId: string) {
  try {
    await removeFavorite(imdbId);

    favorites.value =
      favorites.value.filter(
        (favorite) =>
          favorite.imdbId !== imdbId,
      );
  } catch (err: any) {
    error.value =
      err.response?.data?.message ??
      'Não foi possível remover o filme.';
  }
}

function openMovie(imdbId: string) {
  router.push(`/movies/${imdbId}`);
}

onMounted(loadFavorites);
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold">
          Minha Lista
        </h1>

        <p class="text-medium-emphasis">
          Seus filmes e séries favoritos
        </p>
      </div>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}
    </v-alert>

    <div
      v-if="loading"
      class="d-flex justify-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <v-alert
      v-else-if="favorites.length === 0"
      type="info"
      variant="tonal"
    >
      <v-alert-title>
        Sua lista está vazia
      </v-alert-title>

      Adicione filmes à sua lista para
      encontrá-los aqui.
    </v-alert>

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
          class="d-flex flex-column"
        >
          <v-img
            :src="favorite.poster"
            :alt="favorite.title"
            height="360"
            cover
          />

          <v-card-title>
            {{ favorite.title }}
          </v-card-title>

          <v-card-subtitle>
            {{ favorite.year || 'Ano não informado' }}
          </v-card-subtitle>

          <v-spacer />

          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click="openMovie(favorite.imdbId)"
            >
              Ver detalhes
            </v-btn>

            <v-spacer />

            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              color="error"
              @click="
                handleRemove(favorite.imdbId)
              "
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>