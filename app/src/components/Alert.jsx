import { Button } from "./Button";
import { useI18n } from "../i18n/useI18n";

export function Alert({ title, detail, onRetry }) {
  const { t } = useI18n();
  return (
    <div className="alert" role="alert">
      <div className="alert__title">{title ?? t("common.error")}</div>
      {detail ? <div className="alert__detail">{detail}</div> : null}
      {onRetry ? (
        <div className="alert__actions">
          <Button variant="secondary" type="button" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

