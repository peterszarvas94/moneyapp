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

  initialEvent: Event;
  setInitialEvent: Dispatch<SetStateAction<Event>>;

  payments: PaymentWithPayee[];
  setPayments: Dispatch<SetStateAction<PaymentWithPayee[]>>;

  initialPayments: PaymentWithPayee[];
  setInitialPayments: Dispatch<SetStateAction<PaymentWithPayee[]>>;

  saving: number;
  setSaving: Dispatch<SetStateAction<number>>;

  initialSaving: number;
  setInitialSaving: Dispatch<SetStateAction<number>>;

  portion: number;
  setPortion: Dispatch<SetStateAction<number>>;

  initialPortion: number;
  setInitialPortion: Dispatch<SetStateAction<number>>;

  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

export const EventContext = createContext<Context | null>(null);

interface Props {
  event: Event;
  payments: PaymentWithPayee[];
  saving: number;
  portion: number;
  editing?: boolean;
  children: ReactNode;
}

export function EventContextProvider({
  event: propEvent,
  payments: propPayments,
  saving: propSaving,
  portion: propPortion,
  editing: propEditing,
  children
}: Props) {
  const [event, setEvent] = useState<Event>(propEvent);
  const [initialEvent, setInitialEvent] = useState<Event>(propEvent);

  const [payments, setPayments] = useState<PaymentWithPayee[]>(propPayments);
  const [initialPayments, setInitialPayments] = useState<PaymentWithPayee[]>(propPayments);

  const [saving, setSaving] = useState<number>(propSaving);
  const [initialSaving, setInitialSaving] = useState<number>(propSaving);

  const [portion, setPortion] = useState<number>(propPortion);
  const [initialPortion, setInitialPortion] = useState<number>(propPortion);

  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(propEditing ?? false);

  return (
    <EventContext.Provider value={{
      event,
      setEvent,

      initialEvent,
      setInitialEvent,

      payments,
      setPayments,

      initialPayments,
      setInitialPayments,

      saving,
      setSaving,

      initialSaving,
      setInitialSaving,

      portion,
      setPortion,

      initialPortion,
      setInitialPortion,

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
