import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { I18nProvider } from "../src/i18n/I18nProvider.jsx";
import App from "../src/App.jsx";

vi.mock("../src/services/doctors.service.js", () => ({
  listDoctors: vi.fn(async () => ({ success: true, data: [], message: "doctor.listed" })),
  createDoctor: vi.fn(async () => ({ success: true, data: {}, message: "doctor.created" })),
}));

vi.mock("../src/services/patients.service.js", () => ({
  listPatients: vi.fn(async () => ({ success: true, data: [], message: "patient.listed" })),
  createPatient: vi.fn(async () => ({ success: true, data: {}, message: "patient.created" })),
}));

function renderApp(initialPath = "/medicos") {
  return render(
    <I18nProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </I18nProvider>
  );
}

describe("SPA (feature)", () => {
  it("renders sidebar and navigates to patients", async () => {
    const user = userEvent.setup();
    renderApp("/medicos");

    expect(await screen.findByRole("heading", { name: "Médicos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pacientes" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Pacientes" }));
    expect(await screen.findByRole("heading", { name: "Pacientes" })).toBeInTheDocument();
  });

  it("doctor form is controlled and can be filled", async () => {
    const user = userEvent.setup();
    renderApp("/medicos");

    const nome = await screen.findByPlaceholderText("João da Silva");
    const crm = screen.getByPlaceholderText("123456");
    const uf = screen.getByPlaceholderText("CE");

    await user.type(nome, "Joao");
    await user.type(crm, "123");
    await user.type(uf, "ce");

    expect(nome).toHaveValue("Joao");
    expect(crm).toHaveValue("123");
    expect(uf).toHaveValue("ce");
  });
});

