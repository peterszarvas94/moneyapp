import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import Skeleton from "~/components/Skeleton";
import { AppContext } from "~/context/app";
import { api } from "~/utils/api";

function AdminList() {
  return (
    <>
      <div className="pt-6 italic">Admins of this account:</div>
      <List />
    </>
  )
}

function List() {
  const router = useRouter();
  const { account, user: self } = useContext(AppContext);
  const { data: admins, refetch: getAdmins } = api.account.getAdmins.useQuery({ accountId: account?.id });
  const { mutateAsync: deleteAdmin } = api.admin.delete.useMutation();

  if (!admins) {
    return (
      <Skeleton />
    )
  }

  if (admins.length === 0) {
    return (
      <div>No admins</div>
    )
  }

  return (
    <>
      {
        admins.map((admin) => (
          <li key={admin.id} className="flex items-center">
            <div>{`${admin.name} (${admin.email})`}</div>
            <button
              className="text-xl"
              onClick={async () => {
                if (!account) {
                  return;
                }

                if (admins.length === 1) {
                  toast.error('There always should be at least 1 admin for each account');
                  return;
                }

                if (confirm(`Are you sure you want to delete ${admin.name} (${admin.email}) as admin of account ${account.name}?`)) {
                  try {
                    await deleteAdmin({
                      userId: admin.id,
                      accountId: account.id
                    })
                    toast.success('Admin deleted');
                    getAdmins();
                  } catch (e) { }
                }

                if (self && self.id === admin.id) {
                  router.push("/dashboard/accounts");
                }
              }}
            >
              <TiDelete />
            </button>
          </li>
        ))
      }
    </>
  )
}

export default AdminList;
