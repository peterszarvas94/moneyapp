import { createContext, useContext } from "react";

type Context = {
  eventId: string;
}

export const EventContext = createContext<Context | null>(null);

export function useEventContext() {
  const context = useContext(EventContext);
  if (context === null) {
    throw new Error("useEvent must be used within a EventContextProvider");
  }

  const { eventId } = context;

  return {
    eventId,
  }
}
