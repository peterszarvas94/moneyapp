import type { User } from "~/server/db/schema";
import { useState } from "react";
import { api } from "~/utils/api";

function useSearchUser() {
  const { mutateAsync, isLoading } = api.user.getByEmail.useMutation();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const search = async (email: string) => {
    try {
      const found = await mutateAsync({ email });
      if (!found) {
        setUser(null);
        return;
      }
      setUser(found);
    } catch (e) {
      setUser(null);
    }
  }

  return {
    isLoading,
    user,
    search,
  }
}

export default useSearchUser;
