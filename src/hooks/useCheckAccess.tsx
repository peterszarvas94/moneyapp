import { useContext } from "react";
import { AccountContext } from "~/context/account";
import { UserContext } from "~/context/user";
import { api } from "~/utils/api";

function useCheckAccess() {
  const { user } = useContext(UserContext);
  const { id: accountId } = useContext(AccountContext);
  const { data: adminAccess } = api.accountAdmin.checkAccess.useQuery({
    userId: user?.id,
    accountId
  });
  const { data: viewerAccess } = api.accountViewer.checkAccess.useQuery({
    userId: user?.id,
    accountId
  });

  return {
    adminAccess,
    viewerAccess
  }
}

export default useCheckAccess;
