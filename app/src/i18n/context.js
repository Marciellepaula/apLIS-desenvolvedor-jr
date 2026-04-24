import { createContext } from "react";

export const I18nContext = createContext({
  locale: "pt",
  t: (k) => k,
  setLocale: () => {},
});

