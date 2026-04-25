import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { useI18n } from "../../i18n/useI18n";
import { useAsync } from "../../hooks/useAsync";
import {
  createDoctor,
  deleteDoctor,
  listDoctors,
  updateDoctor,
} from "../../services/doctors.service";

const EMPTY_FORM = { nome: "", CRM: "", UFCRM: "" };

export function DoctorsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const canSubmit = useMemo(
    () => form.nome.trim() && form.CRM.trim() && form.UFCRM.trim().length === 2,
    [form]
  );

  const canUpdate = useMemo(
    () => editForm.nome.trim() && editForm.CRM.trim() && editForm.UFCRM.trim().length === 2,
    [editForm]
  );

  const { run: listRun, loading: listLoading, error: listError } = useAsync(listDoctors);
  const { run: createRun, loading: createLoading, error: createError } = useAsync(createDoctor);
  const { run: updateRun, loading: updateLoading, error: updateError } = useAsync(updateDoctor);
  const { run: deleteRun, loading: deleteLoading, error: deleteError } = useAsync(deleteDoctor);

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
    await createRun({ ...form, UFCRM: form.UFCRM.toUpperCase() });
    setForm(EMPTY_FORM);
    await load();
  }

  function startEdit(item) {
    setEditItem(item);
    setEditForm({ nome: item.nome, CRM: item.CRM, UFCRM: item.UFCRM });
  }

  async function onUpdate(e) {
    e.preventDefault();
    if (!canUpdate || !editItem) return;
    await updateRun(editItem.id, { ...editForm, UFCRM: editForm.UFCRM.toUpperCase() });
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

      <section className="card">
        <h2 className="card__title">{t("doctor.create")}</h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="grid">
            <Field label={t("form.nome")}>
              <input
                value={form.nome}
                onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))}
                placeholder="João da Silva"
              />
            </Field>
            <Field label={t("form.crm")}>
              <input
                value={form.CRM}
                onChange={(e) => setForm((s) => ({ ...s, CRM: e.target.value }))}
                placeholder="123456"
              />
            </Field>
            <Field label={t("form.ufcrm")}>
              <input
                value={form.UFCRM}
                onChange={(e) => setForm((s) => ({ ...s, UFCRM: e.target.value }))}
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
                <th className="col-actions">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.nome}</td>
                  <td>{it.CRM}</td>
                  <td>{it.UFCRM}</td>
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
                  <td colSpan="5" style={{ textAlign: "center" }}>
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
              <h3 className="modal__title">{t("doctor.edit")}</h3>
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
                <Field label={t("form.crm")}>
                  <input
                    value={editForm.CRM}
                    onChange={(e) => setEditForm((s) => ({ ...s, CRM: e.target.value }))}
                  />
                </Field>
                <Field label={t("form.ufcrm")}>
                  <input
                    value={editForm.UFCRM}
                    onChange={(e) => setEditForm((s) => ({ ...s, UFCRM: e.target.value }))}
                    maxLength={2}
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
