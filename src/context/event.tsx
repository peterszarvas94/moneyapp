import { createContext } from "react";

type Context = {
  eventId: number;
}

const initialContext: Context = {} as Context;
export const EventContext = createContext<Context>(initialContext);
