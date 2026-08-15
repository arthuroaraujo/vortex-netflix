import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Auth API", () => {
  const email = `test-${Date.now()}@example.com`;

  const user = {
    name: "Test User",
    email,
    password: "Test@123456",
  };

  let token = "";

  it("deve criar um novo usuário", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");

    expect(response.body.email).toBe(user.email);
  });

  it("deve realizar login com credenciais válidas", async () => {
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

  it("deve rejeitar login com senha incorreta", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: user.email,
        password: "senha-incorreta",
      });

    expect(response.status).toBe(401);
  });

  it("deve retornar o usuário autenticado", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set(
        "Authorization",
        `Bearer ${token}`,
      );

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty(
      "userId",
    );

    expect(
      typeof response.body.userId,
    ).toBe("number");
  });

  it("deve rejeitar acesso ao /auth/me sem token", async () => {
    const response = await request(app)
      .get("/auth/me");

    expect(response.status).toBe(401);
  });
});