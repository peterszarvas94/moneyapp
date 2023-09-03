import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type Context = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

export const EventContext = createContext<Context | null>(null);

interface Props {
  editing?: boolean;
  children: ReactNode;
}

export function EventContextProvider({
  editing: propEditing,
  children
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(propEditing ?? false);

  return (
    <EventContext.Provider value={{
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
