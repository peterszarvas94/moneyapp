import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Access } from "~/utils/types";
import useIdParser from "./useIdParser";

function usePageLoader() {
  // 1. parse id
  const { parsedId } = useIdParser("accountId");

  // 2. check access
  const { mutateAsync: checkAccess, error } = api.account.checkAccess.useMutation();
  const [access, setAccess] = useState<Access | "denied" | null>(null);

  useEffect(() => {
    async function check(accountId: string) {
      try {
        const access = await checkAccess({ accountId });
        setAccess(access);
      } catch (e) {
        setAccess(null);
      }
    }

    if (parsedId) {
      check(parsedId);
    }
  }, [parsedId]);

  // 3. check if unauth
  useEffect(() => {
    if (error) {
      setAccess("denied");
    }
  }, [error]);

  return {
    accountId: parsedId,
    access,
  }
}

export default usePageLoader;
