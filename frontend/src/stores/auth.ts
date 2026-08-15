import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  type LoginData,
  type RegisterData,
  type User,
} from '../services/AuthService';

export const useAuthStore =
  defineStore('auth', () => {
    const token = ref<string | null>(
      localStorage.getItem('voxter_token'),
    );

    const user = ref<User | null>(null);

    const isAuthenticated = computed(
      () => !!token.value,
    );

    async function login(
      data: LoginData,
    ) {
      const response =
        await loginRequest(data);

      token.value = response.token;

      localStorage.setItem(
        'voxter_token',
        response.token,
      );

      if (response.user) {
        user.value = response.user;
      } else {
        user.value = await getMe(
          response.token,
        );
      }
    }

    async function register(
      data: RegisterData,
    ) {
      const response =
        await registerRequest(data);

      token.value = response.token;

      localStorage.setItem(
        'voxter_token',
        response.token,
      );

      if (response.user) {
        user.value = response.user;
      } else {
        user.value = await getMe(
          response.token,
        );
      }
    }

    async function loadUser() {
      if (!token.value) {
        return;
      }

      try {
        user.value = await getMe(
          token.value,
        );
      } catch {
        logout();
      }
    }

    function logout() {
      token.value = null;
      user.value = null;

      localStorage.removeItem(
        'voxter_token',
      );
    }

    return {
      token,
      user,
      isAuthenticated,
      login,
      register,
      loadUser,
      logout,
    };
  });