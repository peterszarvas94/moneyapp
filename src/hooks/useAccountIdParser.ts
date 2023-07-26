import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext } from "~/context/app";

function useAccountIdParser() {
  const router = useRouter();
  const { accountId } = router.query;
  const { setAccountId } = useContext(AppContext);

  useEffect(() => {
    if (typeof accountId !== "string") {
      return;
    }
    const parsed = parseInt(accountId);
    if (isNaN(parsed)) {
      return;
    }
    setAccountId(parsed);
  }, [accountId]);

  return;
}

export default useAccountIdParser;
