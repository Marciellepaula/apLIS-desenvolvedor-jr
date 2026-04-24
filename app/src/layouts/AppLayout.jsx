import { NavLink, Outlet } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

export function AppLayout() {
  const { t } = useI18n();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__brand">apLIS</div>
        <nav className="sidebar__nav">
          <NavLink className="sidebar__link" to="/medicos">
            {t("nav.doctors")}
          </NavLink>
          <NavLink className="sidebar__link" to="/pacientes">
            {t("nav.patients")}
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

