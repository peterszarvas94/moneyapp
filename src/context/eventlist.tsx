import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type Context = {
  adding: boolean,
  setAdding: (open: boolean) => void,
}

export const EventListContext = createContext<Context | null>(null);

interface Props {
  children: ReactNode;
}

export function EventListProvider({ children }: Props) {
  const [adding, setAdding] = useState(false);

  return (
    <EventListContext.Provider value={{
      adding,
      setAdding,
    }}>
      {children}
    </EventListContext.Provider>
  )
}

export function useEventListContext() {
  const context = useContext(EventListContext);
  if (context === null) {
    throw new Error("useEventListContext must be used within a EventListContext.Provider");
  }

  return context;
}
