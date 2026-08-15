import { createRouter, createWebHistory } from "vue-router";

import CatalogView from "./views/CatalogView.vue";
import MovieDetailsView from "./views/MovieDetailsView.vue";
import LoginView from "./views/LoginView.vue";
import RegisterView from "./views/RegisterView.vue";

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
  ],
});

export default router;
