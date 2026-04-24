import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DoctorsPage } from "./pages/Doctors/DoctorsPage";
import { PatientsPage } from "./pages/Patients/PatientsPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/medicos" replace />} />
        <Route path="/medicos" element={<DoctorsPage />} />
        <Route path="/pacientes" element={<PatientsPage />} />
      </Route>
    </Routes>
  );
}
