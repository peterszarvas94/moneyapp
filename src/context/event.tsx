import { createContext } from "react";

type Context = {
  eventId: string;
}

const initialContext: Context = {} as Context;
export const EventContext = createContext<Context>(initialContext);
