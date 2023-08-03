import { createContext } from "react";

type Context = {
  accountId: number;
}

const initialContext: Context = {} as Context;
export const AccountContext = createContext<Context>(initialContext);
