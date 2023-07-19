import type { User } from "~/server/db/schema";
import { useState } from "react";
import { api } from "~/utils/api";

function useSearchUser() {
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = api.user.getByEmail.useMutation();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const search = async (email: string) => {
    setLoading(true);
    try {
      const found = await mutateAsync({ email });
      if (!found) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(found);
      setLoading(false);
    } catch (e) {
      setUser(null);
      setLoading(false);
    }
  }

  return {
    loading,
    user,
    search,
  }
}

export default useSearchUser;
