import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

export type Access = "admin" | "viewer" | "denied";

interface CheckAccessProps {
  accountId: number | undefined;
}
function useAccountAccessCheck({ accountId }: CheckAccessProps) {
  const [access, setAccess] = useState<Access>("denied");
  const [checked, setChecked] = useState<boolean>(false);
  const { user } = useUser();
  const { mutateAsync: checkAdminAccess } = api.accountAdmin.checkAdminAccess.useMutation();
  const { data } = api.user.getByClerkId.useQuery({ clerkId: user?.id });

  useEffect(() => {
    if (!user || !accountId || !data) {
      return;
    }
    check({ accountId, userId: data.id });
  }, [user, accountId, data]);

  async function check({ accountId, userId }: { accountId: number, userId: number }) {
    try {
      await checkAdminAccess({
        accountId,
        userId
      });
      setAccess("admin");
      setChecked(true);
    } catch (e) {
      setChecked(true);
      return;
    }
  }

  return {
    access,
    checked
  };
}

export default useAccountAccessCheck;
