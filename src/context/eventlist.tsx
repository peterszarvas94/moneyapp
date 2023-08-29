import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { api } from "~/utils/api";
import type { Event } from "~/server/db/schema";

type Context = {
  adding: boolean,
  setAdding: (open: boolean) => void,
  events: Event[] | null | undefined,
  getEvents: () => void,
}

export const EventListContext = createContext<Context | null>(null);

interface Props {
  accountId: string;
  children: ReactNode;
}

export function EventListProvider({ accountId, children }: Props) {
  const [adding, setAdding] = useState(false);
  const { data: events, refetch: getEvents } = api.account.getEvents.useQuery({ accountId });

  return (
    <EventListContext.Provider value={{
      adding,
      setAdding,

      events,
      getEvents,
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
