import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/db/pool.js", () => {
  const rows = [
    {
      id: 1,
      nome: "Maria",
      dataNascimento: "1990-01-01",
      carteirinha: "CAR123",
      cpf: "12345678909",
    },
  ];

  return {
    getPool: () => ({
      query: vi.fn(async () => [rows]),
      execute: vi.fn(async (sql) => {
        if (sql.startsWith("SELECT") && sql.includes("WHERE id")) return [[rows[0]]];
        if (sql.startsWith("INSERT")) return [{ insertId: 2 }];
        if (sql.startsWith("UPDATE")) return [{ affectedRows: 1 }];
        if (sql.startsWith("DELETE")) return [{ affectedRows: 1 }];
        return [[]];
      }),
    }),
  };
});

import { createApp } from "../src/app.js";

describe("Pacientes API (feature)", () => {
  it("GET /api/v1/pacientes returns standard envelope", async () => {
    const app = createApp();
    const res = await request(app).get("/api/v1/pacientes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: expect.any(Array),
      message: "patient.listed",
    });
  });

  it("POST /api/v1/pacientes validates body", async () => {
    const app = createApp();
    const res = await request(app).post("/api/v1/pacientes").send({ nome: "x" });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("validation.failed");
    expect(res.body.errors).toBeTruthy();
  });

  it("POST /api/v1/pacientes creates and returns created envelope", async () => {
    const app = createApp();
    const res = await request(app).post("/api/v1/pacientes").send({
      nome: "Joao",
      dataNascimento: "1990-01-01",
      carteirinha: "CAR999",
      cpf: "11122233344",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("patient.created");
    expect(res.body.data).toBeTruthy();
  });
});

