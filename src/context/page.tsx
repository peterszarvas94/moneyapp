import type { ReactNode } from "react";
import type { Page } from "~/utils/types";
import { createContext, useContext, useState } from "react";

type Context = {
  page: Page,
}

export const PageContext = createContext<Context | null>(null);

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === null) {
    throw new Error("usePageContext must be used within a PageContext.Provider");
  }

  const { page } = context;

  return {
    page
  }
}
