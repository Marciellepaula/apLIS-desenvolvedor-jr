import { http } from "./http";

const BASE = "http://localhost:3001/api/v1/pacientes";

export async function listPatients() {
  const { data } = await http.get(BASE);
  return data;
}

export async function createPatient(payload) {
  const { data } = await http.post(BASE, payload);
  return data;
}

export async function updatePatient(id, payload) {
  const { data } = await http.put(`${BASE}/${id}`, payload);
  return data;
}

export async function deletePatient(id) {
  const { data } = await http.delete(`${BASE}/${id}`);
  return data;
}
