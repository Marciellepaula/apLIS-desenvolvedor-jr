import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRepo = vi.hoisted(() => ({
  list: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("./paciente.repository.js", () => ({
  PacienteRepository: vi.fn(() => mockRepo),
}));

import { PacienteService } from "./paciente.service.js";

describe("PacienteService", () => {
  let service;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PacienteService();
  });

  describe("list", () => {
    it("returns all patients from repo", async () => {
      const patients = [{ id: 1, nome: "Maria", cpf: "12345678909" }];
      mockRepo.list.mockResolvedValue(patients);

      expect(await service.list()).toEqual(patients);
      expect(mockRepo.list).toHaveBeenCalledOnce();
    });
  });

  describe("get", () => {
    it("returns patient when found", async () => {
      const patient = { id: 1, nome: "Maria" };
      mockRepo.findById.mockResolvedValue(patient);

      expect(await service.get(1)).toEqual(patient);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
    });

    it("returns null when not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      expect(await service.get(99)).toBeNull();
    });
  });

  describe("create", () => {
    it("creates and returns the new patient", async () => {
      const payload = { nome: "Joao", cpf: "12345678901", carteirinha: "CAR001" };
      const created = { id: 5, ...payload };
      mockRepo.create.mockResolvedValue(5);
      mockRepo.findById.mockResolvedValue(created);

      const result = await service.create(payload);
      expect(result).toEqual(created);
      expect(mockRepo.create).toHaveBeenCalledWith(payload);
      expect(mockRepo.findById).toHaveBeenCalledWith(5);
    });
  });

  describe("update", () => {
    it("returns updated patient when found", async () => {
      const payload = { nome: "Joao Updated", cpf: "12345678901", carteirinha: "CAR001" };
      const updated = { id: 1, ...payload };
      mockRepo.update.mockResolvedValue(true);
      mockRepo.findById.mockResolvedValue(updated);

      expect(await service.update(1, payload)).toEqual(updated);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
    });

    it("returns null when patient not found", async () => {
      mockRepo.update.mockResolvedValue(false);

      expect(await service.update(99, {})).toBeNull();
      expect(mockRepo.findById).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("returns true when deleted", async () => {
      mockRepo.delete.mockResolvedValue(true);
      expect(await service.delete(1)).toBe(true);
    });

    it("returns false when not found", async () => {
      mockRepo.delete.mockResolvedValue(false);
      expect(await service.delete(99)).toBe(false);
    });
  });
});
