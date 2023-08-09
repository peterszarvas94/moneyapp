import { createContext, useContext } from "react";
import { User } from "~/server/db/schema";

type Context = {
  admins: User[];
  viewers: User[];
  isLoading: boolean;
}

export const RolesContext = createContext<Context | null>(null);

export function useRolesContext() {
  const context = useContext(RolesContext);
  if (context === null) {
    throw new Error("useRoles must be used within a RolesContextProvider");
  }
  
  const { admins, viewers, isLoading } = context;

  return {
    admins,
    viewers,
    isLoading,
  }
}
