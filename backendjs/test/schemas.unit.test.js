import { describe, expect, it } from "vitest";
import { pacienteCreateSchema } from "../src/pacientes/paciente.schemas.js";

describe("Paciente schemas (unit)", () => {
  it("accepts a valid payload", () => {
    const parsed = pacienteCreateSchema.parse({
      body: {
        nome: "Maria",
        dataNascimento: "1990-01-01",
        carteirinha: "CAR123",
        cpf: "12345678909",
      },
    });
    expect(parsed.body.nome).toBe("Maria");
  });

  it("rejects invalid cpf", () => {
    expect(() =>
      pacienteCreateSchema.parse({
        body: { nome: "Maria", carteirinha: "CAR123", cpf: "abc" },
      })
    ).toThrow();
  });
});

