<script setup lang="ts">
import { onMounted } from "vue";

import AppNavbar from "./components/AppNavbar.vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  authStore.loadUser();
});
</script>

<template>
  <v-app>
    <AppNavbar />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
