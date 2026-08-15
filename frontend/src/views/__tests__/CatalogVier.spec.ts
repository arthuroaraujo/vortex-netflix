import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";

import CatalogView from "../CatalogView.vue";

const { searchMoviesMock, getMovieByIdMock } = vi.hoisted(() => ({
  searchMoviesMock: vi.fn(),
  getMovieByIdMock: vi.fn(),
}));

vi.mock("../../services/MovieService", () => ({
  searchMovies: searchMoviesMock,
  getMovieById: getMovieByIdMock,
}));

describe("CatalogView", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getMovieByIdMock.mockResolvedValue({
      imdbID: "tt0372784",
      Title: "Batman Begins",
      Year: "2005",
      Type: "movie",
      Poster: "poster.jpg",
    });
  });

  function mountView() {
    return mount(CatalogView, {
      global: {
        stubs: {
          "v-container": {
            template: "<div><slot /></div>",
          },

          "v-form": {
            template:
              "<form @submit=\"$emit('submit', $event)\"><slot /></form>",
          },

          "v-row": {
            template: "<div><slot /></div>",
          },

          "v-col": {
            template: "<div><slot /></div>",
          },

          "v-text-field": {
            props: ["modelValue", "label"],
            emits: ["update:modelValue"],

            template: `
              <input
                :value="modelValue"
                :aria-label="label"
                @input="
                  $emit(
                    'update:modelValue',
                    $event.target.value
                  )
                "
              />
            `,
          },

          "v-btn": {
            props: ["type"],
            template: '<button :type="type"><slot /></button>',
          },

          "v-alert": {
            template: "<div><slot /></div>",
          },

          "v-progress-circular": {
            template: "<div>Loading...</div>",
          },

          MovieCard: {
            props: ["movie"],
            template: `
              <div class="movie-card">
                {{ movie.Title }}
              </div>
            `,
          },

          MovieCardSkeleton: {
            template: '<div class="movie-skeleton">Skeleton</div>',
          },
        },
      },
    });
  }

  it("deve renderizar a página inicial", () => {
    const wrapper = mountView();

    expect(wrapper.text()).toContain("Buscar");

    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("deve carregar os filmes em destaque", async () => {
    const wrapper = mountView();

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Batman Begins");
    });

    expect(getMovieByIdMock).toHaveBeenCalled();

    expect(wrapper.text()).toContain("Batman Begins");
  });

  it("deve exibir mensagem quando a busca estiver vazia", async () => {
    const wrapper = mountView();

    const input = wrapper.find("input");

    await input.setValue("");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Digite o nome de um filme ou série.");

    expect(searchMoviesMock).not.toHaveBeenCalled();
  });

  it("deve realizar uma busca de filmes", async () => {
    searchMoviesMock.mockResolvedValue({
      Search: [
        {
          imdbID: "tt0372784",
          Title: "Batman Begins",
          Year: "2005",
          Type: "movie",
          Poster: "poster.jpg",
        },
      ],
      totalResults: "1",
      Response: "True",
    });

    const wrapper = mountView();

    const input = wrapper.find("input");

    await input.setValue("Batman");

    await wrapper.find("form").trigger("submit");

    await vi.waitFor(() => {
      expect(searchMoviesMock).toHaveBeenCalledWith("Batman");
    });

    expect(wrapper.text()).toContain("Resultados da busca");

    expect(wrapper.text()).toContain("Batman Begins");
  });

  it("deve exibir mensagem quando nenhum filme for encontrado", async () => {
    searchMoviesMock.mockResolvedValue({
      Search: [],
      totalResults: "0",
      Response: "False",
      Error: "Movie not found!",
    });

    const wrapper = mountView();

    const input = wrapper.find("input");

    await input.setValue("FilmeQueNaoExiste");

    await wrapper.find("form").trigger("submit");

    await vi.waitFor(() => {
      expect(searchMoviesMock).toHaveBeenCalledWith("FilmeQueNaoExiste");
    });

    expect(wrapper.text()).toContain("Nenhum filme ou série encontrado.");
  });

  it("deve exibir erro quando a busca falhar", async () => {
    searchMoviesMock.mockRejectedValue(new Error("API error"));

    const wrapper = mountView();

    const input = wrapper.find("input");

    await input.setValue("Batman");

    await wrapper.find("form").trigger("submit");

    await vi.waitFor(() => {
      expect(searchMoviesMock).toHaveBeenCalledWith("Batman");
    });

    expect(wrapper.text()).toContain("Não foi possível realizar a busca.");
  });
});
