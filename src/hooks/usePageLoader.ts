import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "~/context/account";

function usePageLoader() {
  const router = useRouter();
  const { id: routerId } = router.query;
  const { setId } = useContext(AccountContext);

  useEffect(() => {
    if (typeof routerId !== "string") {
      return;
    }
    const parsed = parseInt(routerId);
    if (isNaN(parsed)) {
      return;
    }
    setId(parsed);
  }, [routerId]);

  return {};
}

export default usePageLoader;
