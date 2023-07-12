import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

type Access = "admin" | "viewer" | null;

interface CheckAccessProps {
  accountId: number | undefined;
  clerkId: string | undefined;
}

function useCheckAccessToAccount({ accountId, clerkId }: CheckAccessProps) {
  const [access, setAccess] = useState<Access>(null);
  const { mutateAsync: checkAdminAccess } = api.accountAdmin.checkAdminAccessByClerkId.useMutation();

  async function check() {
    try {
      const res = await checkAdminAccess({
        accountId,
        clerkId,
      });
      if (res === true) {
        setAccess("admin");
      }
    } catch (e) {}
  }

  useEffect(() => {
    check();
  }, [accountId, clerkId]);

  return {
    access,
    check,
  };
}

export default useCheckAccessToAccount;
