import { createContext, useContext } from "react";

type Context = {
  membershipId: string;
}

export const MemberContext = createContext<Context | null>(null);

export function useMemberContext() {
  const context = useContext(MemberContext);
  if (context === null) {
    throw new Error("useMemberContext must be used within a MemberContextProvider");
  }
  
  const { membershipId } = context;

  return {
    membershipId,
  }
}
