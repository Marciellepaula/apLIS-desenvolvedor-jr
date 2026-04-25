import { http } from "./http";

const BASE = "http://localhost:3002/api/v1/medicos";

export async function listDoctors() {
  const { data } = await http.get(BASE);
  return data;
}

export async function createDoctor(payload) {
  const { data } = await http.post(BASE, payload);
  return data;
}

export async function updateDoctor(id, payload) {
  const { data } = await http.put(`${BASE}/${id}`, payload);
  return data;
}

export async function deleteDoctor(id) {
  const { data } = await http.delete(`${BASE}/${id}`);
  return data;
}
