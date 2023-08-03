import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useAccountIdParser() {
  const router = useRouter();
  const { accountId } = router.query;
  const [realId, setRealId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof accountId !== "string") {
      return;
    }
    const parsed = parseInt(accountId);
    if (isNaN(parsed)) {
      return;
    }
    setRealId(parsed);
  }, [accountId]);

  return {
    accountId: realId
  }
}

export default useAccountIdParser;
