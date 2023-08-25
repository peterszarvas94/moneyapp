import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Event } from "~/server/db/schema";
import { PaymentWithPayee } from "~/utils/types";

//old

type old_Context = {
  eventId: string;
}

export const old_EventContext = createContext<old_Context | null>(null);

export function old_useEventContext() {
  const context = useContext(old_EventContext);
  if (context === null) {
    throw new Error("old_useEventContext must be used within a old_EventContext.Provider");
  }

  const { eventId } = context;

  return {
    eventId,
  }
}

//new

type Context = {
  event: Event;
  setEvent: Dispatch<SetStateAction<Event>>;
  payments: PaymentWithPayee[];
  setPayments: Dispatch<SetStateAction<PaymentWithPayee[]>>;
  saving: number;
  setSaving: Dispatch<SetStateAction<number>>;
  portion: number;
  setPortion: Dispatch<SetStateAction<number>>;
}

export const EventContext = createContext<Context | null>(null);

interface Props {
  event: Event;
  payments: PaymentWithPayee[];
  saving: number;
  portion: number;
  children: ReactNode;
}

export function EventContextProvider({
  event: initialEvent,
  payments: initialPayments,
  saving: initialSavings,
  portion: initialPortion,
  children
}: Props) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const [payments, setPayments] = useState<PaymentWithPayee[]>(initialPayments);
  const [saving, setSaving] = useState<number>(initialSavings);
  const [portion, setPortion] = useState<number>(initialPortion);

  return (
    <EventContext.Provider value={{
      event,
      setEvent,
      payments,
      setPayments,
      saving,
      setSaving,
      portion,
      setPortion,
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

  const {
    event,
    setEvent,
    payments,
    setPayments,
    saving,
    setSaving,
    portion,
    setPortion,
  } = context;

  return {
    event,
    setEvent,
    payments,
    setPayments,
    saving,
    setSaving,
    portion,
    setPortion,
  }
}
