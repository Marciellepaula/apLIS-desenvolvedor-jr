import { http } from "./http";

const BASE = "http://localhost:8000/api/v1/pacientes";

export async function listPatients() {
  const { data } = await http.get(BASE);
  return data;
}

export async function createPatient(payload) {
  const { data } = await http.post(BASE, payload);
  return data;
}

