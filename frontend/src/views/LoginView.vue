<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const loading = ref(false);
const error = ref("");

const emailRules = [
  (value: string) => !!value || "O e-mail é obrigatório.",
  (value: string) => /.+@.+\..+/.test(value) || "Digite um e-mail válido.",
];

const passwordRules = [
  (value: string) => !!value || "A senha é obrigatória.",
  (value: string) =>
    value.length >= 6 || "A senha deve ter pelo menos 6 caracteres.",
];

async function handleLogin() {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Preencha e-mail e senha.";
    return;
  }

  if (!/.+@.+\..+/.test(email.value)) {
    error.value = "Digite um e-mail válido.";
    return;
  }

  if (password.value.length < 6) {
    error.value = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    await router.push("/");
  } catch (err: any) {
    error.value =
      err.response?.data?.message ?? "Não foi possível realizar o login.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="420" class="pa-6">
      <v-card-title class="text-h4 font-weight-bold text-center mb-6">
        Flixter
      </v-card-title>

      <v-card-subtitle class="text-center mb-6">
        Entre na sua conta
      </v-card-subtitle>

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="E-mail"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          :rules="emailRules"
          validate-on="blur"
          autocomplete="email"
          class="mb-2"
        />

        <v-text-field
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="passwordRules"
          validate-on="blur"
          autocomplete="current-password"
          class="mb-4"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          :disabled="loading"
        >
          Entrar
        </v-btn>
      </v-form>

      <div class="text-center mt-6">
        <span> Ainda não tem uma conta? </span>

        <v-btn variant="text" color="primary" @click="router.push('/register')">
          Criar conta
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>
