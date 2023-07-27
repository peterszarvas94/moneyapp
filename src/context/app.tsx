import type { Event, Account, User } from "~/server/db/schema";
import type { ReactNode } from "react";
import { createContext, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

type AppContextType = {
  // user
  user: User | null | undefined;

  // account
  account: Account | null | undefined;
  refetch: () => void;
  accountId: number | undefined;
  setAccountId: (id: number) => void;
  access: boolean;
  setAccess: (access: boolean) => void;

  // event
  eventId: number | undefined;
  setEventId: (id: number) => void;
  event: Event | null | undefined;
}

const initialContext: AppContextType = {} as AppContextType;
export const AppContext = createContext<AppContextType>(initialContext);

interface Props {
  children: ReactNode;
}
function ContextProvider({ children }: Props) {
  const { user: clerkUser } = useUser();
  const { data: user } = api.user.getByClerkId.useQuery({ clerkId: clerkUser?.id });

  const [accountId, setAccountId] = useState<number | undefined>(undefined);
  const [access, setAccess] = useState<boolean>(false);
  const { data: account, refetch } = api.account.get.useQuery({ accountId: access ? accountId : undefined });

  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const { data: event } = api.event.get.useQuery({ eventId: access ? eventId : undefined });

  return (
    <AppContext.Provider value={{
      user,

      account,
      refetch,
      accountId,
      setAccountId,
      access,
      setAccess,

      eventId,
      setEventId,
      event
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default ContextProvider;
