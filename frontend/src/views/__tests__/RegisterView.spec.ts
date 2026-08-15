import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import RegisterView from "../RegisterView.vue";

const registerMock = vi.fn();
const pushMock = vi.fn();

vi.mock("../../stores/auth", () => ({
  useAuthStore: () => ({
    register: registerMock,
  }),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("RegisterView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mountView() {
    return mount(RegisterView, {
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

  it("deve renderizar o formulário de cadastro", () => {
    const wrapper = mountView();

    expect(wrapper.text()).toContain("Criar conta");

    expect(wrapper.text()).toContain("Já possui uma conta?");

    expect(wrapper.text()).toContain("Entrar");
  });

  it("deve exibir erro quando os campos estiverem vazios", async () => {
    const wrapper = mountView();

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Preencha todos os campos.");

    expect(registerMock).not.toHaveBeenCalled();
  });

  it("deve exibir erro para e-mail inválido", async () => {
    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("Arthur");
    await inputs[1].setValue("email-invalido");
    await inputs[2].setValue("123456");
    await inputs[3].setValue("123456");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Digite um e-mail válido.");

    expect(registerMock).not.toHaveBeenCalled();
  });

  it("deve exibir erro para senha com menos de 6 caracteres", async () => {
    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("Arthur");
    await inputs[1].setValue("arthur@email.com");
    await inputs[2].setValue("123");
    await inputs[3].setValue("123");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain(
      "A senha deve ter pelo menos 6 caracteres.",
    );

    expect(registerMock).not.toHaveBeenCalled();
  });

  it("deve exibir erro quando as senhas não coincidirem", async () => {
    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("Arthur");
    await inputs[1].setValue("arthur@email.com");
    await inputs[2].setValue("123456");
    await inputs[3].setValue("654321");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("As senhas não coincidem.");

    expect(registerMock).not.toHaveBeenCalled();
  });

  it("deve realizar cadastro e redirecionar para o login", async () => {
    registerMock.mockResolvedValue(undefined);

    const wrapper = mountView();

    const inputs = wrapper.findAll("input");

    await inputs[0].setValue("Arthur");
    await inputs[1].setValue("arthur@email.com");
    await inputs[2].setValue("123456");
    await inputs[3].setValue("123456");

    await wrapper.find("form").trigger("submit");

    expect(registerMock).toHaveBeenCalledWith({
      name: "Arthur",
      email: "arthur@email.com",
      password: "123456",
    });

    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
