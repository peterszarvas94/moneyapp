import type { User } from "~/server/db/schema";
import type { ReactNode } from "react";
import { createContext } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

type UserContextType = {
  user: User | null | undefined;
}

const initialContext: UserContextType = { user: undefined }
export const UserContext = createContext<UserContextType>(initialContext);

interface UserProviderProps {
  children: ReactNode;
}
function UserProvider({ children }: UserProviderProps) {
  const { user: userFormClerk } = useUser();
  const { data: userFromDB } = api.user.getByClerkId.useQuery({ clerkId: userFormClerk?.id });

  return (
    <UserContext.Provider value={{ user: userFromDB }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
