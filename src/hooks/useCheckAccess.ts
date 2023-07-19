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

  useEffect(() => {
    if (!user || !accountId) {
      return;
    }
    check({ accountId, clerkId: user.id });
  }, [user, accountId]);

  async function check({ accountId, clerkId }: { accountId: number, clerkId: string }) {
    try {
      await checkAdminAccess({
        accountId,
        clerkId,
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
