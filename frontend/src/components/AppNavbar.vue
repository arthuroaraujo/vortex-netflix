<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();

  router.push('/login');
}
</script>

<template>
  <v-app-bar
    color="surface"
    elevation="2"
  >
    <v-container
      class="d-flex align-center"
    >
      <v-btn
        variant="text"
        class="text-h5 font-weight-bold"
        @click="router.push('/')"
      >
        Flixter
      </v-btn>

      <v-spacer />

      <v-btn
        variant="text"
        prepend-icon="mdi-home-outline"
        @click="router.push('/')"
      >
        Início
      </v-btn>

      <v-btn
        v-if="authStore.isAuthenticated"
        variant="text"
        prepend-icon="mdi-heart-outline"
        @click="router.push('/favorites')"
      >
        Minha Lista
      </v-btn>

      <v-menu
        v-if="authStore.isAuthenticated"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-account-circle-outline"
          />
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>
              {{ authStore.user?.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ authStore.user?.email }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <v-list-item
            prepend-icon="mdi-logout"
            @click="logout"
          >
            <v-list-item-title>
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        color="primary"
        variant="flat"
        @click="router.push('/login')"
      >
        Entrar
      </v-btn>
    </v-container>
  </v-app-bar>
</template>