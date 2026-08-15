import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import CatalogView from './views/CatalogView.vue';
import MovieDetailsView from './views/MovieDetailsView.vue';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'catalog',
      component: CatalogView,
    },
    {
      path: '/movies/:imdbId',
      name: 'movie-details',
      component: MovieDetailsView,
    },
  ],
});

export default router;