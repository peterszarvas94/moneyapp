import { createContext, useContext } from "react";
import { User } from "~/server/db/schema";

type Context = {
  admins: User[];
  viewers: User[];
  isLoading: boolean;
}

export const MemberContext = createContext<Context | null>(null);

export function useMemberContext() {
  const context = useContext(MemberContext);
  if (context === null) {
    throw new Error("useMemberContext must be used within a MemberContextProvider");
  }
  
  const { admins, viewers, isLoading } = context;

  return {
    admins,
    viewers,
    isLoading,
  }
}
