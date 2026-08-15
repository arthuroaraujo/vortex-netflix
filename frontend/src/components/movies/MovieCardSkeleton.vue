<template>
  <v-card
    height="100%"
    class="movie-card-skeleton"
  >
    <v-skeleton-loader
      type="image"
      height="360"
    />

    <v-card-item>
      <v-skeleton-loader
        type="heading"
        class="mb-2"
      />

      <v-skeleton-loader
        type="text"
        width="60%"
      />
    </v-card-item>

    <v-spacer />

    <v-card-actions>
      <v-skeleton-loader
        type="button"
        width="120"
      />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.movie-card-skeleton {
  overflow: hidden;
}
</style>