import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const mockRepo = vi.hoisted(() => ({
  list: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../pacientes/paciente.repository.js", () => ({
  PacienteRepository: vi.fn(() => mockRepo),
}));

const PATIENT = { id: 1, nome: "Maria", cpf: "12345678909", carteirinha: "CAR123", dataNascimento: "1990-01-01" };
const VALID_PAYLOAD = { nome: "Carlos", cpf: "98765432100", carteirinha: "CAR999" };

describe("GET /api/v1/pacientes", () => {
  let app;
  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  it("returns 200 with patient list", async () => {
    mockRepo.list.mockResolvedValue([PATIENT]);

    const res = await request(app).get("/api/v1/pacientes");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([PATIENT]);
  });
});

describe("GET /api/v1/pacientes/:id", () => {
  let app;
  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  it("returns 200 when patient exists", async () => {
    mockRepo.findById.mockResolvedValue(PATIENT);

    const res = await request(app).get("/api/v1/pacientes/1");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(PATIENT);
  });

  it("returns 404 when patient not found", async () => {
    mockRepo.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/pacientes/999");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("returns 422 for non-numeric id", async () => {
    const res = await request(app).get("/api/v1/pacientes/abc");
    expect(res.status).toBe(422);
  });
});

describe("POST /api/v1/pacientes", () => {
  let app;
  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  it("returns 201 on successful creation", async () => {
    mockRepo.create.mockResolvedValue(10);
    mockRepo.findById.mockResolvedValue({ id: 10, ...VALID_PAYLOAD });

    const res = await request(app).post("/api/v1/pacientes").send(VALID_PAYLOAD);
    expect(res.status).toBe(201);
  });

  it("returns 422 for missing required fields", async () => {
    const res = await request(app).post("/api/v1/pacientes").send({ nome: "Carlos" });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it("returns 422 for invalid cpf format", async () => {
    const res = await request(app).post("/api/v1/pacientes").send({ ...VALID_PAYLOAD, cpf: "123" });
    expect(res.status).toBe(422);
  });
});

describe("PUT /api/v1/pacientes/:id", () => {
  let app;
  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  it("returns 200 on successful update", async () => {
    mockRepo.update.mockResolvedValue(true);
    mockRepo.findById.mockResolvedValue({ id: 1, ...VALID_PAYLOAD });

    const res = await request(app).put("/api/v1/pacientes/1").send(VALID_PAYLOAD);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 when patient not found", async () => {
    mockRepo.update.mockResolvedValue(false);

    const res = await request(app).put("/api/v1/pacientes/999").send(VALID_PAYLOAD);
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/v1/pacientes/:id", () => {
  let app;
  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  it("returns 200 on successful delete", async () => {
    mockRepo.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/v1/pacientes/1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 when patient not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    const res = await request(app).delete("/api/v1/pacientes/999");
    expect(res.status).toBe(404);
  });
});
