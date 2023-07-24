import { useRouter } from "next/router";
import useParseId from "./useParseId";
import useCheckAccess from "./useCheckAccess";

function usePageLoader() {
  const router = useRouter();
  const { id } = router.query;
  const { parsedId } = useParseId({ id });

  const { access, checked } = useCheckAccess({ accountId: parsedId });

  return {
    access,
    checked,
    id: parsedId,
  }
}

export default usePageLoader;
