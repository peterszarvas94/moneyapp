import { createContext } from "react";

type Context = {
  accountId: string;
}

const initialContext: Context = {} as Context;
export const AccountContext = createContext<Context>(initialContext);
