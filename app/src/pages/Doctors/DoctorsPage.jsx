import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { useI18n } from "../../i18n/useI18n";
import { useAsync } from "../../hooks/useAsync";
import { createDoctor, listDoctors } from "../../services/doctors.service";

export function DoctorsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({ nome: "", CRM: "", UFCRM: "" });

  const canSubmit = useMemo(
    () =>
      form.nome.trim() &&
      form.CRM.trim() &&
      form.UFCRM.trim().length === 2,
    [form]
  );

  const {
    run: listRun,
    loading: listLoading,
    error: listError,
  } = useAsync(listDoctors);

  const {
    run: createRun,
    loading: createLoading,
    error: createError,
  } = useAsync(createDoctor);

  const load = useCallback(async () => {
    const res = await listRun();
    setItems(res.data ?? []);
  }, [listRun]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    await createRun({
      ...form,
      UFCRM: form.UFCRM.toUpperCase(),
    });

    setForm({ nome: "", CRM: "", UFCRM: "" });
    await load();
  }

  const isLoading = listLoading || createLoading;
  const error = listError || createError;

  return (
    <div className="stack">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">{t("doctor.title")}</h1>
          <p className="pageSubtitle">{t("doctor.list")}</p>
        </div>
      </header>

      {error && (
        <Alert
          title={t("common.error")}
          detail={error?.response?.data?.message ?? error?.message}
          onRetry={load}
        />
      )}

      {/* FORM */}
      <section className="card">
        <h2 className="card__title">{t("doctor.create")}</h2>

        <form className="form" onSubmit={onSubmit}>
          <div className="grid">
            <Field label={t("form.nome")}>
              <input
                value={form.nome}
                onChange={(e) =>
                  setForm((s) => ({ ...s, nome: e.target.value }))
                }
                placeholder="João da Silva"
              />
            </Field>

            <Field label={t("form.crm")}>
              <input
                value={form.CRM}
                onChange={(e) =>
                  setForm((s) => ({ ...s, CRM: e.target.value }))
                }
                placeholder="123456"
              />
            </Field>

            <Field label={t("form.ufcrm")}>
              <input
                value={form.UFCRM}
                onChange={(e) =>
                  setForm((s) => ({ ...s, UFCRM: e.target.value }))
                }
                placeholder="CE"
                maxLength={2}
              />
            </Field>
          </div>

          <div className="form__actions">
            <Button disabled={!canSubmit || isLoading} type="submit">
              {isLoading ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </form>
      </section>

      {/* TABELA */}
      <section className="card">
        <h2 className="card__title">{t("common.list")}</h2>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("form.nome")}</th>
                <th>{t("form.crm")}</th>
                <th>{t("form.ufcrm")}</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.nome}</td>
                  <td>{it.CRM}</td>
                  <td>{it.UFCRM}</td>
                </tr>
              ))}

              {items.length === 0 && !listLoading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Sem dados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}