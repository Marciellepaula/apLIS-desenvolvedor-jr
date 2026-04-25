import { ok, fail } from "../http/response.js";
import { PacienteService } from "./paciente.service.js";
import { detectLang, translate } from "../i18n/translator.js";

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
      const lang = detectLang(req);
      res.status(201).json({ message: translate('patient.created', lang), data });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const data = await this.service.get(req.validated.params.id);
      const lang = detectLang(req);
      if (!data) return res.status(404).json(fail(translate('patient.not_found', lang)));
      res.json(ok(data, translate('patient.found', lang)));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.service.update(req.validated.params.id, req.validated.body);
      const lang = detectLang(req);
      if (!data) return res.status(404).json(fail(translate('patient.not_found', lang)));
      res.json(ok(data, translate('patient.updated', lang)));
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      const okDeleted = await this.service.delete(req.validated.params.id);
      const lang = detectLang(req);
      if (!okDeleted) return res.status(404).json(fail(translate('patient.not_found', lang)));
      res.json(ok(null, translate('patient.deleted', lang)));
    } catch (err) {
      next(err);
    }
  };
}
