import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Access } from "~/utils/types";

function usePageLoader() {
  const router = useRouter();
  const { accountId } = router.query;
  const [realId, setRealId] = useState<string | null>(null);

  const { mutateAsync: checkAccess, error } = api.account.checkAccess.useMutation();
  const [access, setAccess] = useState<Access | "denied" | null>(null);

  // 1. get account id
  useEffect(() => {
    if (typeof accountId === "string") {
      setRealId(accountId);
    }
  }, [accountId]);

  // 2. check access
  useEffect(() => {
    async function check(accountId: string) {
      try {
        const access = await checkAccess({ accountId });
        setAccess(access);
      } catch (e) {
        setAccess(null);
      }
    }

    if (realId) {
      check(realId);
    }
  }, [realId]);

  // 3. check if unauth
  useEffect(() => {
    if (error) {
      setAccess("denied");
    }
  }, [error]);

  return {
    accountId: realId,
    access,
  }
}

export default usePageLoader;
