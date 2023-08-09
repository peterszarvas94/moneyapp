import { TRPCClientError } from "@trpc/client";
import { TRPCErrorShape } from "@trpc/server/rpc";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardLoading from "~/components/CardLoading";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import { AccountContext } from "~/context/account";
import { User } from "~/server/db/schema";
import { api } from "~/utils/api";

export default function MemberList() {
  const { accountId } = useContext(AccountContext);
  const { data: roles, refetch } = api.account.getRoles.useQuery({ accountId });

  const [admins, setAdmins] = useState<User[] | null>(null);
  const [viewers, setViewers] = useState<User[] | null>(null);

  useEffect(() => {
    if (roles) {
      const newAdmins = roles.filter(role => role.access === "admin").map(role => role.user);
      setAdmins(newAdmins);

      const newViewers = roles.filter(role => role.access === "viewer").map(role => role.user);
      setViewers(newViewers);
      console.log(roles);
    }
  }, [roles]);

  return (
    <>
      <div className="px-4 pt-4">
        <Card>
          <CardTitle title="Admins" />
          <List nodata="No admins." users={admins} refetch={refetch} />
        </Card>
      </div>
      <div className="px-4 pt-4">
        <Card>
          <CardTitle title="Viewers" />
          <List nodata="No viewers." users={viewers} refetch={refetch}/>
        </Card>
      </div>
    </>
  )
}

interface Props {
  nodata: string,
  users: User[] | null,
  refetch: () => void
}

function List({ nodata, users, refetch }: Props) {
  const { accountId, access } = useContext(AccountContext);
  const { data: self } = api.user.getSelf.useQuery();
  const { mutateAsync: deleteRole } = api.membership.delete.useMutation();

  if (!users || !self) {
    return (
      <CardLoading />
    )
  }

  if (users.length === 0) {
    return (
      <CardNoItem>{nodata}</CardNoItem>
    )
  }

  return (
    <ul>
      {
        users.map((user) => (
          <CardLi key={user.id}>
            <div>{`${user.name} (${user.email})`}</div>

            {access === "admin" && user.id !== self.id && (
              <button
                className="text-xl"
                onClick={async () => {
                  if (confirm(`Are you sure you want to delete ${user.name} (${user.email}) from this account?`)) {
                    try {
                      await deleteRole({
                        userId: user.id,
                        accountId
                      })
                      toast.success('Admin deleted');
                      refetch();
                    } catch (e) {
                      const err = e as TRPCClientError<TRPCErrorShape>;
                      toast.error(err.message);
                    }
                  }
                }}
              >
                <TiDelete className="hover:text-red-400" />
              </button>
            )}
          </CardLi>
        ))
      }
    </ul>
  )
}
