import { http } from "./http";

// Local development endpoints
const BASE = "http://localhost:3002/api/v1/medicos";

export async function listDoctors() {
  const { data } = await http.get(BASE);
  return data;
}

export async function createDoctor(payload) {
  const { data } = await http.post(BASE, payload);
  return data;
}

