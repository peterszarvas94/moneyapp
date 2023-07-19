import { useRouter } from "next/router";
import useParseId from "./useParseId";
import useAccountAccessCheck from "./useCheckAccess";

function usePageLoader() {
  const router = useRouter();
  const { id } = router.query;
  const { parsedId } = useParseId({ id });

  const { access, checked } = useAccountAccessCheck({ accountId: parsedId });

  return {
    access,
    checked,
    id: parsedId,
  }
}

export default usePageLoader;
