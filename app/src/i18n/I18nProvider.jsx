import { useMemo, useState } from "react";
import { I18nContext } from "./context";
import { messages } from "./messages";

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("pt");

  const value = useMemo(() => {
    const dict = messages[locale] ?? {};
    const t = (key) => dict[key] ?? key;
    return { locale, setLocale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

