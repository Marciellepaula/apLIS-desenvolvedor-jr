import { PacienteRepository } from "./paciente.repository.js";

export class PacienteService {
  constructor() {
    this.repo = new PacienteRepository();
  }

  async list() {
    return this.repo.list();
  }

  async get(id) {
    return this.repo.findById(id);
  }

  async create(payload) {
    const id = await this.repo.create(payload);
    return this.repo.findById(id);
  }

  async update(id, payload) {
    const ok = await this.repo.update(id, payload);
    if (!ok) return null;
    return this.repo.findById(id);
  }

  async delete(id) {
    return this.repo.delete(id);
  }
}

