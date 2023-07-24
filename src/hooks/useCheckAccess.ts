import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

export type Access = "admin" | "viewer" | "denied";

interface CheckAccessProps {
  accountId: number | undefined;
}
function useCheckAccess({ accountId }: CheckAccessProps) {
  const [access, setAccess] = useState<Access>("denied");
  const [checked, setChecked] = useState<boolean>(false);
  const { user } = useUser();
  const { mutateAsync: checkAdminAccess } = api.accountAdmin.checkAdminAccess.useMutation();
  const { mutateAsync: checkViewerAccess } = api.accountViewer.checkViewerAccess.useMutation();
  const { data } = api.user.getByClerkId.useQuery({ clerkId: user?.id });

  useEffect(() => {
    if (!user || !accountId || !data) {
      return;
    }
    check({ accountId, userId: data.id });
  }, [user, accountId, data]);

  async function check({ accountId, userId }: { accountId: number, userId: number }) {
    try {
      const isAdmin = await checkAdminAccess({
        accountId,
        userId
      });
      if (isAdmin) {
        setAccess("admin");
        setChecked(true);
        return;
      }
    } catch (e) {}

    try {
      const isViewer = await checkViewerAccess({
        accountId,
        userId
      });
      if (isViewer) {
        setAccess("viewer");
        setChecked(true);
        return;
      }
    } catch (e) {}

    setAccess("denied");
    setChecked(true);
  }

  return {
    access,
    checked,
  };
}

export default useCheckAccess;
