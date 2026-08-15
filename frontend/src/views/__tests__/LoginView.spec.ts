import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import LoginView from "../LoginView.vue";

const loginMock = vi.fn();

const pushMock = vi.fn();

vi.mock("../../stores/auth", () => ({
  useAuthStore: () => ({
    login: loginMock,
  }),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("LoginView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mountView() {
    return mount(LoginView, {
      global: {
        stubs: {
          "v-container": {
            template: "<div><slot /></div>",
          },
          "v-card": {
            template: "<div><slot /></div>",
          },
          "v-card-title": {
            template: "<div><slot /></div>",
          },
          "v-card-subtitle": {
            template: "<div><slot /></div>",
          },
          "v-alert": {
            template: "<div><slot /></div>",
          },
          "v-form": {
            template:
              "<form @submit=\"$emit('submit', $event)\"><slot /></form>",
          },
          "v-text-field": {
            props: ["modelValue", "label", "type"],
            emits: ["update:modelValue"],
            template: `
              <input
                :value="modelValue"
                :aria-label="label"
                :type="type"
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
        },
      },
    });
  }

  it("deve renderizar o formulário de login", () => {
    const wrapper = mountView();

    expect(wrapper.text()).toContain("Flixter");

    expect(wrapper.text()).toContain("Entre na sua conta");

    expect(wrapper.text()).toContain("Entrar");

    expect(wrapper.text()).toContain("Ainda não tem uma conta?");
  });

  it("deve exibir erro quando os campos estiverem vazios", async () => {
    const wrapper = mountView();

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Preencha e-mail e senha.");

    expect(loginMock).not.toHaveBeenCalled();
  });

  it("deve exibir erro para e-mail inválido", async () => {
    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("email-invalido");

    await inputs[1].setValue("123456");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Digite um e-mail válido.");

    expect(loginMock).not.toHaveBeenCalled();
  });

  it("deve exibir erro para senha com menos de 6 caracteres", async () => {
    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("arthur@email.com");

    await inputs[1].setValue("123");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain(
      "A senha deve ter pelo menos 6 caracteres.",
    );

    expect(loginMock).not.toHaveBeenCalled();
  });

  it("deve realizar login e redirecionar para a home", async () => {
    loginMock.mockResolvedValue(undefined);

    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("arthur@email.com");

    await inputs[1].setValue("123456");

    await wrapper.find("form").trigger("submit");

    expect(loginMock).toHaveBeenCalledWith({
      email: "arthur@email.com",
      password: "123456",
    });

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
