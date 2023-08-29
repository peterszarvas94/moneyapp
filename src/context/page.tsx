import type { Page } from "~/utils/types";
import { createContext, useContext } from "react";

type Context = {
  page: Page,
}

export const PageContext = createContext<Context | null>(null);

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === null) {
    throw new Error("usePageContext must be used within a PageContext.Provider");
  }

  return context;
}
