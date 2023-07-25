
import type { Account } from "~/server/db/schema";
import type { ReactNode } from "react";
import { createContext, useState } from "react";
import { api } from "~/utils/api";

type AccountContextType = {
  account: Account | null | undefined;
  id: number | undefined;
  setId: (id: number) => void;
  refetch: () => void;
}

const initialContext: AccountContextType = {
  account: undefined,
  id: undefined,
  setId: () => { },
  refetch: () => { }
}
export const AccountContext = createContext<AccountContextType>(initialContext);

interface AccountProviderProps {
  children: ReactNode;
}
function AccountProvider({ children }: AccountProviderProps) {
  const [id, setId] = useState<number | undefined>(undefined);
  const { data: account, refetch } = api.account.get.useQuery({ id });

  return (
    <AccountContext.Provider value={{
      account,
      id,
      setId,
      refetch
    }}>
      {children}
    </AccountContext.Provider>
  );
};
export default AccountProvider;
