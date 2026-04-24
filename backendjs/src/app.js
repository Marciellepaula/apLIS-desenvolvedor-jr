import express from "express";
import { pacientesRouter } from "./routes/pacientes.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/v1/pacientes", pacientesRouter);

  app.use(errorHandler);

  return app;
}

