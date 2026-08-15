<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const error = ref("");

const nameRules = [
  (value: string) =>
    !!value || "O nome é obrigatório.",
];

const emailRules = [
  (value: string) =>
    !!value || "O e-mail é obrigatório.",
  (value: string) =>
    /.+@.+\..+/.test(value) ||
    "Digite um e-mail válido.",
];

const passwordRules = [
  (value: string) =>
    !!value || "A senha é obrigatória.",
  (value: string) =>
    value.length >= 6 ||
    "A senha deve ter pelo menos 6 caracteres.",
];

const confirmPasswordRules = [
  (value: string) =>
    !!value ||
    "Confirme sua senha.",
  (value: string) =>
    value === password.value ||
    "As senhas não coincidem.",
];

async function handleRegister() {
  error.value = "";

  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value =
      "Preencha todos os campos.";
    return;
  }

  if (!/.+@.+\..+/.test(email.value)) {
    error.value =
      "Digite um e-mail válido.";
    return;
  }

  if (password.value.length < 6) {
    error.value =
      "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  if (
    password.value !==
    confirmPassword.value
  ) {
    error.value =
      "As senhas não coincidem.";
    return;
  }

  loading.value = true;

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    await router.push("/login");
  } catch (err: any) {
    error.value =
      err.response?.data?.message ??
      "Não foi possível criar a conta.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container
    class="fill-height d-flex align-center justify-center"
  >
    <v-card
      width="420"
      class="pa-6"
    >
      <v-card-title
        class="text-h4 font-weight-bold text-center mb-6"
      >
        Criar conta
      </v-card-title>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <v-form
        @submit.prevent="handleRegister"
      >
        <v-text-field
          v-model="name"
          label="Nome"
          prepend-inner-icon="mdi-account-outline"
          :rules="nameRules"
          validate-on="blur"
          class="mb-2"
        />

        <v-text-field
          v-model="email"
          label="E-mail"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          :rules="emailRules"
          validate-on="blur"
          class="mb-2"
        />

        <v-text-field
          v-model="password"
          label="Senha"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
          :rules="passwordRules"
          validate-on="blur"
          class="mb-2"
        />

        <v-text-field
          v-model="confirmPassword"
          label="Confirmar senha"
          type="password"
          prepend-inner-icon="mdi-lock-check-outline"
          :rules="confirmPasswordRules"
          validate-on="blur"
          class="mb-4"
        />

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
        >
          Criar conta
        </v-btn>
      </v-form>

      <div class="text-center mt-6">
        <span>
          Já possui uma conta?
        </span>

        <v-btn
          variant="text"
          color="primary"
          @click="router.push('/login')"
        >
          Entrar
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>