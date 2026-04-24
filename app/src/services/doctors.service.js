import { http } from "./http";

// In Docker/prod, frontend Nginx proxies:
// /api/php  -> backend-php
// /api/node -> backend-node
const BASE = "/api/php/api/v1/medicos";

export async function listDoctors() {
  const { data } = await http.get(BASE);
  return data;
}

export async function createDoctor(payload) {
  const { data } = await http.post(BASE, payload);
  return data;
}

