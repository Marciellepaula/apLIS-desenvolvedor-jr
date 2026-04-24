import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { useI18n } from "../../i18n/useI18n";
import { useAsync } from "../../hooks/useAsync";
import { createPatient, listPatients } from "../../services/patients.service";

export function PatientsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    dataNascimento: "",
    carteirinha: "",
    cpf: "",
  });

  const canSubmit = useMemo(
    () => form.nome.trim() && form.carteirinha.trim() && /^\d{11}$/.test(form.cpf.trim()),
    [form]
  );

  const { run: listRun, loading: listLoading, error: listError } = useAsync(listPatients);
  const { run: createRun, loading: createLoading, error: createError } = useAsync(createPatient);

  const load = useCallback(async () => {
    const res = await listRun();
    setItems(res.data ?? []);
  }, [listRun]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    await createRun({
      ...form,
      dataNascimento: form.dataNascimento?.trim() ? form.dataNascimento : undefined,
      cpf: form.cpf.trim(),
    });

    setForm({ nome: "", dataNascimento: "", carteirinha: "", cpf: "" });
    await load();
  }

  const isLoading = listLoading || createLoading;
  const error = listError || createError;

  return (
    <div className="stack">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">{t("patient.title")}</h1>
          <p className="pageSubtitle">{t("patient.list")}</p>
        </div>
      </header>

      {error ? (
        <Alert
          title={t("common.error")}
          detail={error?.response?.data?.message ?? error?.message}
          onRetry={load}
        />
      ) : null}

      <section className="card">
        <h2 className="card__title">{t("patient.create")}</h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="grid">
            <Field label={t("form.nome")}>
              <input
                value={form.nome}
                onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))}
                placeholder="Maria"
              />
            </Field>
            <Field label={t("form.dataNascimento")}>
              <input
                type="date"
                value={form.dataNascimento}
                onChange={(e) => setForm((s) => ({ ...s, dataNascimento: e.target.value }))}
              />
            </Field>
            <Field label={t("form.carteirinha")}>
              <input
                value={form.carteirinha}
                onChange={(e) => setForm((s) => ({ ...s, carteirinha: e.target.value }))}
                placeholder="CAR123"
              />
            </Field>
            <Field label={t("form.cpf")} hint="Somente números (11 dígitos)">
              <input
                value={form.cpf}
                onChange={(e) =>
                  setForm((s) => ({ ...s, cpf: e.target.value.replace(/[^\d]/g, "") }))
                }
                placeholder="12345678909"
                inputMode="numeric"
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

      <section className="card">
        <h2 className="card__title">{t("common.list")}</h2>
        <div className="table">
          <div className="table__head">
            <div>ID</div>
            <div>{t("form.nome")}</div>
            <div>{t("form.dataNascimento")}</div>
            <div>{t("form.carteirinha")}</div>
            <div>{t("form.cpf")}</div>
          </div>
          {items.map((it) => (
            <div className="table__row" key={it.id}>
              <div>{it.id}</div>
              <div>{it.nome}</div>
              <div>{it.dataNascimento ?? "-"}</div>
              <div>{it.carteirinha}</div>
              <div>{it.cpf}</div>
            </div>
          ))}
          {items.length === 0 && !listLoading ? (
            <div className="table__empty">Sem dados.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

