import { createContext } from "react";
import { Access } from "~/utils/types";

type Context = {
  accountId: string;
  access: Access;
}

const initialContext: Context = {} as Context;
export const AccountContext = createContext<Context>(initialContext);
