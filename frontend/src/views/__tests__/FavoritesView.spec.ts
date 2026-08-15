import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";

import FavoritesView from "../FavoritesView.vue";

const { getFavoritesMock, removeFavoriteMock, pushMock } = vi.hoisted(() => ({
  getFavoritesMock: vi.fn(),
  removeFavoriteMock: vi.fn(),
  pushMock: vi.fn(),
}));

vi.mock("../../services/FavoriteService", () => ({
  getFavorites: getFavoritesMock,
  removeFavorite: removeFavoriteMock,
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("FavoritesView", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getFavoritesMock.mockResolvedValue([
      {
        id: 1,
        imdbId: "tt0372784",
        title: "Batman Begins",
        poster: "poster.jpg",
        year: "2005",
        createdAt: "2026-08-15T00:00:00.000Z",
      },
      {
        id: 2,
        imdbId: "tt4154796",
        title: "Avengers: Endgame",
        poster: "poster-2.jpg",
        year: "2019",
        createdAt: "2026-08-15T00:00:00.000Z",
      },
    ]);
  });

  function mountView() {
    return mount(FavoritesView, {
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

          "v-card": {
            template: "<div @click=\"$emit('click')\"><slot /></div>",
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

          "v-card-title": {
            template: "<div><slot /></div>",
          },

          "v-card-subtitle": {
            template: "<div><slot /></div>",
          },

          "v-card-actions": {
            template: "<div><slot /></div>",
          },

          "v-btn": {
            props: ["loading", "disabled"],
            emits: ["click"],
            template: `
    <button
      :disabled="disabled"
      @click="$emit('click')"
    >
      <slot />
    </button>
  `,
          },

          "v-spacer": {
            template: "<span />",
          },

          "v-alert": {
            template: "<div><slot /></div>",
          },

          "v-progress-circular": {
            template: "<div>Loading...</div>",
          },

          "v-icon": {
            template: "<span><slot /></span>",
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
        },
      },
    });
  }

  it("deve renderizar a página de favoritos", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(getFavoritesMock).toHaveBeenCalled();
    });

    expect(wrapper.text()).toContain("Minha Lista");

    expect(wrapper.text()).toContain("Seus filmes e séries favoritos");
  });

  it("deve carregar e exibir os favoritos", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    expect(wrapper.text()).toContain("Avengers: Endgame");

    expect(wrapper.text()).toContain("2005");

    expect(wrapper.text()).toContain("2019");
  });

  it("deve exibir mensagem quando a lista estiver vazia", async () => {
    getFavoritesMock.mockResolvedValue([]);

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Sua lista está vazia");
    });

    expect(wrapper.text()).toContain(
      "Adicione filmes e séries aos seus favoritos",
    );

    expect(wrapper.text()).toContain("Explorar filmes");
  });

  it("deve redirecionar para o catálogo quando clicar em explorar filmes", async () => {
    getFavoritesMock.mockResolvedValue([]);

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Explorar filmes");
    });

    const buttons = wrapper.findAll("button");

    const exploreButton = buttons.find((button) =>
      button.text().includes("Explorar filmes"),
    );

    expect(exploreButton).toBeDefined();

    await exploreButton!.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("deve abrir os detalhes do filme ao clicar no favorito", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    const movieCard = wrapper.find(".favorite-card");

    expect(movieCard.exists()).toBe(true);

    await movieCard.trigger("click");

    expect(pushMock).toHaveBeenCalledWith("/movies/tt0372784");
  });

  it("deve remover um favorito da lista", async () => {
    removeFavoriteMock.mockResolvedValue(undefined);

    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    const favorite = (wrapper.vm as any).favorites[0];

    expect(favorite).toBeDefined();
    expect(favorite.imdbId).toBe("tt0372784");

    await (wrapper.vm as any).confirmRemove(favorite);

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Remover da minha lista?");

    expect(wrapper.text()).toContain("Batman Begins");

    await (wrapper.vm as any).handleRemove();

    expect(removeFavoriteMock).toHaveBeenCalledWith("tt0372784");

    expect(wrapper.text()).not.toContain("Batman Begins");

    expect(wrapper.text()).toContain("Avengers: Endgame");
  });
});
