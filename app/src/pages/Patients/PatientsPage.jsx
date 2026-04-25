import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { useI18n } from "../../i18n/useI18n";
import { useAsync } from "../../hooks/useAsync";
import {
  createPatient,
  deletePatient,
  listPatients,
  updatePatient,
} from "../../services/patients.service";

const EMPTY_FORM = { nome: "", dataNascimento: "", carteirinha: "", cpf: "" };

export function PatientsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const isValidCpf = (v) => /^\d{11}$/.test(v.trim());

  const canSubmit = useMemo(
    () => form.nome.trim() && form.carteirinha.trim() && isValidCpf(form.cpf),
    [form]
  );

  const canUpdate = useMemo(
    () => editForm.nome.trim() && editForm.carteirinha.trim() && isValidCpf(editForm.cpf),
    [editForm]
  );

  const { run: listRun, loading: listLoading, error: listError } = useAsync(listPatients);
  const { run: createRun, loading: createLoading, error: createError } = useAsync(createPatient);
  const { run: updateRun, loading: updateLoading, error: updateError } = useAsync(updatePatient);
  const { run: deleteRun, loading: deleteLoading, error: deleteError } = useAsync(deletePatient);

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
      dataNascimento: form.dataNascimento?.trim() ? form.dataNascimento : undefined,
      cpf: form.cpf.trim(),
    });
    setForm(EMPTY_FORM);
    await load();
  }

  function startEdit(item) {
    setEditItem(item);
    setEditForm({
      nome: item.nome,
      dataNascimento: item.dataNascimento ?? "",
      carteirinha: item.carteirinha,
      cpf: item.cpf,
    });
  }

  async function onUpdate(e) {
    e.preventDefault();
    if (!canUpdate || !editItem) return;
    await updateRun(editItem.id, {
      ...editForm,
      dataNascimento: editForm.dataNascimento?.trim() ? editForm.dataNascimento : undefined,
      cpf: editForm.cpf.trim(),
    });
    setEditItem(null);
    await load();
  }

  async function onDelete(id) {
    if (!window.confirm(t("common.confirm_delete"))) return;
    try {
      await deleteRun(id);
      await load();
    } catch (_e) {}
  }

  const isLoading = listLoading || createLoading;
  const error = listError || createError || deleteError;

  return (
    <div className="stack">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">{t("patient.title")}</h1>
          <p className="pageSubtitle">{t("patient.list")}</p>
        </div>
      </header>

      {error && (
        <Alert
          title={t("common.error")}
          detail={error?.response?.data?.message ?? error?.message}
          onRetry={load}
        />
      )}

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
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("form.nome")}</th>
                <th>{t("form.dataNascimento")}</th>
                <th>{t("form.carteirinha")}</th>
                <th>{t("form.cpf")}</th>
                <th className="col-actions">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.nome}</td>
                  <td>{it.dataNascimento ?? "-"}</td>
                  <td>{it.carteirinha}</td>
                  <td>{it.cpf}</td>
                  <td className="col-actions">
                    <button className="btn btn--secondary btn--sm" onClick={() => startEdit(it)}>
                      {t("common.edit")}
                    </button>
                    {" "}
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => onDelete(it.id)}
                      disabled={deleteLoading}
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !listLoading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    {t("common.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editItem && (
        <div className="modal-backdrop" onClick={() => setEditItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{t("patient.edit")}</h3>
              <button className="modal__close" onClick={() => setEditItem(null)}>✕</button>
            </div>
            {updateError && (
              <Alert
                title={t("common.error")}
                detail={updateError?.response?.data?.error ?? updateError?.message}
              />
            )}
            <form className="form" onSubmit={onUpdate}>
              <div className="grid">
                <Field label={t("form.nome")}>
                  <input
                    value={editForm.nome}
                    onChange={(e) => setEditForm((s) => ({ ...s, nome: e.target.value }))}
                  />
                </Field>
                <Field label={t("form.dataNascimento")}>
                  <input
                    type="date"
                    value={editForm.dataNascimento}
                    onChange={(e) => setEditForm((s) => ({ ...s, dataNascimento: e.target.value }))}
                  />
                </Field>
                <Field label={t("form.carteirinha")}>
                  <input
                    value={editForm.carteirinha}
                    onChange={(e) => setEditForm((s) => ({ ...s, carteirinha: e.target.value }))}
                  />
                </Field>
                <Field label={t("form.cpf")} hint="Somente números (11 dígitos)">
                  <input
                    value={editForm.cpf}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, cpf: e.target.value.replace(/[^\d]/g, "") }))
                    }
                    inputMode="numeric"
                  />
                </Field>
              </div>
              <div className="form__actions">
                <Button variant="secondary" type="button" onClick={() => setEditItem(null)}>
                  {t("common.cancel")}
                </Button>
                <Button disabled={!canUpdate || updateLoading} type="submit">
                  {updateLoading ? t("common.loading") : t("common.save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
