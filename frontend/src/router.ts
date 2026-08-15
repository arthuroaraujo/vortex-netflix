import { createRouter, createWebHistory } from "vue-router";

import CatalogView from "./views/CatalogView.vue";
import MovieDetailsView from "./views/MovieDetailsView.vue";
import LoginView from "./views/LoginView.vue";
import RegisterView from "./views/RegisterView.vue";
import FavoritesView from "./views/FavoritesView.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "catalog",
      component: CatalogView,
    },
    {
      path: "/movies/:imdbId",
      name: "movie-details",
      component: MovieDetailsView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/favorites",
      name: "favorites",
      component: FavoritesView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to) => {
  const token =
    localStorage.getItem('voxter_token');

  if (
    to.meta.requiresAuth &&
    !token
  ) {
    return '/login';
  }

  if (
    (to.name === 'login' ||
      to.name === 'register') &&
    token
  ) {
    return '/';
  }
});

export default router;
