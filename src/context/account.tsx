import { createContext, useContext } from "react";
import { Access } from "~/utils/types";

type Context = {
  accountId: string;
  access: Access;
}

export const AccountContext = createContext<Context | null>(null);

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (context === null) {
    throw new Error("useAccount must be used within a AccountContextProvider");
  }

  const { accountId, access } = context;

  return {
    accountId,
    access,
  }
}
