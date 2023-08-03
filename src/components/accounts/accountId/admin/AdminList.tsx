import { TRPCClientError } from "@trpc/client";
import { TRPCErrorShape } from "@trpc/server/rpc";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import Skeleton from "~/components/Skeleton";
import { AccountContext } from "~/context/account";
import { api } from "~/utils/api";

function AdminList() {
  return (
    <Card>
      <CardTitle title="Admins" />
      <List />
    </Card>
  )
}

function List() {
  const { accountId } = useContext(AccountContext);
  const { data: admins, refetch: getAdmins } = api.account.getAdmins.useQuery({ accountId });
  const { data: access } = api.account.getAccess.useQuery({ accountId });
  const { data: account } = api.account.get.useQuery({ accountId });
  const { data: self } = api.user.getSelf.useQuery();
  const { mutateAsync: deleteAdmin } = api.admin.delete.useMutation();
    
  if (!admins || !access || !self) {
    return (
      <Skeleton />
    )
  }

  if (admins.length === 0) {
    return (
      <CardNoItem>No admins</CardNoItem>
    )
  }

  return (
    <ul>
      {
        admins.map((admin) => (
          <CardLi key={admin.id}>
            <div>{`${admin.name} (${admin.email})`}</div>
            <button
              className="text-xl"
              onClick={async () => {
                if (!account) {
                  return;
                }

                if (admin.id === self.id) {
                  toast.error('You cannot delete yourself as admin');
                  return;
                }

                if (confirm(`Are you sure you want to delete ${admin.name} (${admin.email}) as admin of account ${account.name}?`)) {
                  console.log(admin.id, account.id);
                  try {
                    await deleteAdmin({
                      userId: admin.id,
                      accountId: account.id
                    })
                    toast.success('Admin deleted');
                    getAdmins();
                  } catch (e) {
                    const err = e as TRPCClientError<TRPCErrorShape>;
                    toast.error(err.message);
                  }
                }
              }}
            >
              <TiDelete className="hover:text-red-400"/>
            </button>
          </CardLi>
        ))
      }
    </ul>
  )
}

export default AdminList;
