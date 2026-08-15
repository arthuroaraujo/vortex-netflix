import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Favorites API", () => {
  const user = {
    name: "Favorite Test User",
    email: `favorite-${Date.now()}@example.com`,
    password: "Test@123456",
  };

  const favorite = {
    imdbId: "tt0372784",
    title: "Batman Begins",
    poster: "https://example.com/batman.jpg",
    year: "2005",
  };

  let token = "";

  it("deve criar um usuário para os testes", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("deve realizar login e obter o token", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    token = response.body.token;
  });

  it("deve adicionar um filme aos favoritos", async () => {
    const response = await request(app)
      .post("/favorites")
      .set("Authorization", `Bearer ${token}`)
      .send(favorite);

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("imdbId");
    expect(response.body).toHaveProperty("title");

    expect(response.body.imdbId).toBe(
      favorite.imdbId,
    );

    expect(response.body.title).toBe(
      favorite.title,
    );
  });

  it("deve impedir que o mesmo filme seja adicionado novamente", async () => {
    const response = await request(app)
      .post("/favorites")
      .set("Authorization", `Bearer ${token}`)
      .send(favorite);

    expect(response.status).toBe(409);

    expect(response.body.message).toBe(
      "Este título já está na sua lista",
    );
  });

  it("deve listar os favoritos do usuário", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body).toHaveLength(1);

    expect(response.body[0].imdbId).toBe(
      favorite.imdbId,
    );
  });

  it("deve rejeitar acesso aos favoritos sem autenticação", async () => {
    const response = await request(app)
      .get("/favorites");

    expect(response.status).toBe(401);
  });

  it("deve remover um filme dos favoritos", async () => {
    const response = await request(app)
      .delete(`/favorites/${favorite.imdbId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 ao tentar remover um favorito inexistente", async () => {
    const response = await request(app)
      .delete(`/favorites/${favorite.imdbId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Título não encontrado na sua lista",
    );
  });
});