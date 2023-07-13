import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

export type Access = "admin" | "viewer" | "denied";

interface CheckAccessProps {
  accountId: number;
}
function useAccountAccessCheck({ accountId }: CheckAccessProps) {
  const [access, setAccess] = useState<Access>("denied");
  const [checked, setChecked] = useState<boolean>(false);
  const { user } = useUser();
  const { mutateAsync: checkAdminAccess } = api.accountAdmin.checkAdminAccess.useMutation();

  useEffect(() => {
    if (!user) {
      return;
    }
    check({ accountId, clerkId: user.id });
  }, [user]);

  async function check({ accountId, clerkId }: { accountId: number, clerkId: string }) {
    try {
      const res = await checkAdminAccess({
        accountId,
        clerkId,
      });
      if (res.accountId === accountId) {
        setAccess("admin");
        setChecked(true);
      }
    } catch (e) {
      return;
    }
  }

  return {
    access,
    checked
  };
}

export default useAccountAccessCheck;
