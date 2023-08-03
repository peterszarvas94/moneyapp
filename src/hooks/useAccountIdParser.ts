import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useAccountIdParser() {
  const router = useRouter();
  const { accountId } = router.query;
  const [realId, setRealId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof accountId === "string") {
      setRealId(accountId);
    }
  }, [accountId]);

  return {
    accountId: realId
  }
}

export default useAccountIdParser;
