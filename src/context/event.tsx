import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Event } from "~/server/db/schema";
import { PaymentWithPayee } from "~/utils/types";

type Context = {
  event: Event;
  payments: PaymentWithPayee[];

  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

export const EventContext = createContext<Context | null>(null);

interface Props {
  event: Event;
  payments: PaymentWithPayee[];
  editing?: boolean;
  children: ReactNode;
}

export function EventContextProvider({
  event,
  payments,
  editing: propEditing,
  children
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(propEditing ?? false);

  return (
    <EventContext.Provider value={{
      event,
      payments,
      
      open,
      setOpen,

      editing,
      setEditing,
    }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (context === null) {
    throw new Error("useEventContext must be used within a EventContext.Provider");
  }

  return context;
}
