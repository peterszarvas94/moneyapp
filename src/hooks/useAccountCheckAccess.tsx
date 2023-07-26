import { useContext, useEffect } from "react";
import { AppContext } from "~/context/app";
import { api } from "~/utils/api";

function useAccountCheckAccess() {
  const { accountId, user, setAccess } = useContext(AppContext);
  const { data: adminAccess } = api.admin.checkAccess.useQuery({
    userId: user?.id,
    accountId: accountId
  });
  const { data: viewerAccess } = api.viewer.checkAccess.useQuery({
    userId: user?.id,
    accountId: accountId
  });

  useEffect(() => {
    if (!adminAccess && !viewerAccess) {
      return;
    }
    setAccess(true);
  }, [adminAccess, viewerAccess])

  return {
    adminAccess,
    viewerAccess
  }
}

export default useAccountCheckAccess;
