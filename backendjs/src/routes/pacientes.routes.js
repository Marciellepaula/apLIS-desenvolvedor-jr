import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import {
  pacienteCreateSchema,
  pacienteIdParamSchema,
  pacienteUpdateSchema,
} from "../pacientes/paciente.schemas.js";
import { PacienteController } from "../pacientes/paciente.controller.js";

export const pacientesRouter = Router();
const controller = new PacienteController();

pacientesRouter.get("/", controller.list);
pacientesRouter.post("/", validate(pacienteCreateSchema), controller.create);

// Extra CRUD
pacientesRouter.get("/:id", validate(pacienteIdParamSchema), controller.get);
pacientesRouter.put("/:id", validate(pacienteUpdateSchema), controller.update);
pacientesRouter.delete("/:id", validate(pacienteIdParamSchema), controller.remove);

