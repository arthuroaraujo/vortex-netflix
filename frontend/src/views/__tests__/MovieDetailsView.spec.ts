import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";

import MovieDetailsView from "../MovieDetailsView.vue";

const {
  getMovieByIdMock,
  getFavoritesMock,
  addFavoriteMock,
  removeFavoriteMock,
  pushMock,
  backMock,
  authStoreMock,
} = vi.hoisted(() => ({
  getMovieByIdMock: vi.fn(),
  getFavoritesMock: vi.fn(),
  addFavoriteMock: vi.fn(),
  removeFavoriteMock: vi.fn(),
  pushMock: vi.fn(),
  backMock: vi.fn(),

  authStoreMock: {
    isAuthenticated: true,
  },
}));

vi.mock("../../services/MovieService", () => ({
  getMovieById: getMovieByIdMock,
}));

vi.mock("../../services/FavoriteService", () => ({
  getFavorites: getFavoritesMock,
  addFavorite: addFavoriteMock,
  removeFavorite: removeFavoriteMock,
}));

vi.mock("../../stores/auth", () => ({
  useAuthStore: () => authStoreMock,
}));

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: {
      imdbId: "tt0372784",
    },
  }),

  useRouter: () => ({
    push: pushMock,
    back: backMock,
  }),
}));

describe("MovieDetailsView", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    authStoreMock.isAuthenticated = true;

    getMovieByIdMock.mockResolvedValue({
      Title: "Batman Begins",
      Year: "2005",
      Rated: "PG-13",
      Released: "15 Jun 2005",
      Runtime: "140 min",
      Genre: "Action, Crime, Drama",
      Director: "Christopher Nolan",
      Writer: "Christopher Nolan",
      Actors: "Christian Bale, Michael Caine",
      Plot: "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City.",
      Language: "English",
      Country: "United States",
      Awards: "Nominated for 1 Oscar.",
      Poster: "poster.jpg",
      Ratings: [],
      imdbRating: "8.2",
      imdbID: "tt0372784",
      Type: "movie",
    });

    getFavoritesMock.mockResolvedValue([]);

    addFavoriteMock.mockResolvedValue({
      id: 1,
      imdbId: "tt0372784",
      title: "Batman Begins",
      poster: "poster.jpg",
      year: "2005",
      createdAt: "2026-08-15T00:00:00.000Z",
    });

    removeFavoriteMock.mockResolvedValue(undefined);
  });

  function mountView() {
    return mount(MovieDetailsView, {
      global: {
        stubs: {
          "v-container": {
            template: "<div><slot /></div>",
          },

          "v-row": {
            template: "<div><slot /></div>",
          },

          "v-col": {
            template: "<div><slot /></div>",
          },

          "v-btn": {
            props: ["loading", "disabled", "type"],
            emits: ["click"],
            template: `
              <button
                :disabled="disabled"
                :type="type"
                @click="$emit('click')"
              >
                <slot />
              </button>
            `,
          },

          "v-img": {
            props: ["src", "alt"],
            template: `
              <img
                :src="src"
                :alt="alt"
              />
            `,
          },

          "v-icon": {
            template: "<span><slot /></span>",
          },

          "v-chip": {
            template: "<span><slot /></span>",
          },

          "v-card": {
            template: "<div><slot /></div>",
          },

          "v-card-title": {
            template: "<div><slot /></div>",
          },

          "v-card-text": {
            template: "<div><slot /></div>",
          },

          "v-card-actions": {
            template: "<div><slot /></div>",
          },

          "v-list": {
            template: "<div><slot /></div>",
          },

          "v-list-item": {
            props: ["title", "subtitle"],
            template: `
              <div>
                <div>{{ title }}</div>
                <div>{{ subtitle }}</div>
              </div>
            `,
          },

          "v-spacer": {
            template: "<span />",
          },

          "v-dialog": {
            props: ["modelValue"],
            emits: ["update:modelValue"],
            template: `
              <div class="v-dialog">
                <slot />
              </div>
            `,
          },

          "v-snackbar": {
            props: ["modelValue", "color"],
            emits: ["update:modelValue"],
            template: `
              <div class="v-snackbar">
                <slot />
                <slot name="actions" />
              </div>
            `,
          },
        },
      },
    });
  }

  it("deve renderizar os detalhes do filme", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    expect(wrapper.text()).toContain("2005");

    expect(wrapper.text()).toContain("140 min");

    expect(wrapper.text()).toContain("Action, Crime, Drama");

    expect(wrapper.text()).toContain("After training with his mentor");

    expect(wrapper.text()).toContain("Christopher Nolan");

    expect(wrapper.text()).toContain("Christian Bale, Michael Caine");
  });

  it("deve carregar o filme pelo IMDb ID", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(getMovieByIdMock).toHaveBeenCalledWith("tt0372784");

      expect(wrapper.text()).toContain("Batman Begins");
    });
  });

  it("deve exibir erro quando não conseguir carregar o filme", async () => {
    getMovieByIdMock.mockRejectedValue(new Error("API error"));

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain(
        "Não foi possível carregar os detalhes do filme.",
      );
    });
  });

  it("deve redirecionar para login quando usuário não autenticado tentar favoritar", async () => {
    authStoreMock.isAuthenticated = false;

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    const favoriteButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Adicionar à minha lista"));

    expect(favoriteButton).toBeDefined();

    await favoriteButton!.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/login");

    expect(addFavoriteMock).not.toHaveBeenCalled();
  });

  it("deve verificar se o filme já está nos favoritos", async () => {
    getFavoritesMock.mockResolvedValue([
      {
        id: 1,
        imdbId: "tt0372784",
        title: "Batman Begins",
        poster: "poster.jpg",
        year: "2005",
        createdAt: "2026-08-15T00:00:00.000Z",
      },
    ]);

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(getFavoritesMock).toHaveBeenCalled();
    });

    expect(wrapper.text()).toContain("Remover da minha lista");
  });

  it("deve adicionar o filme aos favoritos", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    const favoriteButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Adicionar à minha lista"));

    expect(favoriteButton).toBeDefined();

    await favoriteButton!.trigger("click");

    await vi.waitFor(() => {
      expect(addFavoriteMock).toHaveBeenCalledWith({
        imdbId: "tt0372784",
        title: "Batman Begins",
        poster: "poster.jpg",
        year: "2005",
      });
    });

    expect(wrapper.text()).toContain("Filme adicionado à sua lista!");
  });

  it("deve remover o filme dos favoritos", async () => {
    getFavoritesMock.mockResolvedValue([
      {
        id: 1,
        imdbId: "tt0372784",
        title: "Batman Begins",
        poster: "poster.jpg",
        year: "2005",
        createdAt: "2026-08-15T00:00:00.000Z",
      },
    ]);

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Remover da minha lista");
    });

    await (wrapper.vm as any).openRemoveDialog();

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Remover da minha lista?");

    expect(wrapper.text()).toContain("Batman Begins");

    await (wrapper.vm as any).confirmRemove();

    await vi.waitFor(() => {
      expect(removeFavoriteMock).toHaveBeenCalledWith("tt0372784");
    });
  });

  it("deve voltar para a página anterior", async () => {
    const wrapper = mountView();

    const backButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Voltar"));

    expect(backButton).toBeDefined();

    await backButton!.trigger("click");

    expect(backMock).toHaveBeenCalled();
  });
});
