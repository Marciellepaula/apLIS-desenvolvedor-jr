import { ok, created, fail } from "../http/response.js";
import { PacienteService } from "./paciente.service.js";

export class PacienteController {
  constructor() {
    this.service = new PacienteService();
  }

  list = async (_req, res, next) => {
    try {
      const data = await this.service.list();
      res.json(ok(data));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.service.create(req.validated.body);
      res.status(201).send("Paciente criado com sucesso");
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const data = await this.service.get(req.validated.params.id);
      if (!data) return res.status(404).json(fail("patient.not_found"));
      res.json(ok(data, "patient.found"));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.service.update(req.validated.params.id, req.validated.body);
      if (!data) return res.status(404).json(fail("patient.not_found"));
      res.json(ok(data, "patient.updated"));
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      const okDeleted = await this.service.delete(req.validated.params.id);
      if (!okDeleted) return res.status(404).json(fail("patient.not_found"));
      res.json(ok(null, "patient.deleted"));
    } catch (err) {
      next(err);
    }
  };
}

