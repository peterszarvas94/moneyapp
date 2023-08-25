import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type Context = {
  open: boolean,
  setOpen: (open: boolean) => void,
}

export const MenuContext = createContext<Context | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === null) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }

  const { open, setOpen } = context;

  return {
    open,
    setOpen,
  }
}
