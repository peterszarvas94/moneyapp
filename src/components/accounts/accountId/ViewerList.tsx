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

export default function ViewerList() {
  return (
    <div className="px-4 pt-4">
      <Card>
        <CardTitle title="Viewers" />
        <List />
      </Card>
    </div>
  )
}


function List() {
  const { accountId, access } = useContext(AccountContext);
  const { data: roles, refetch: getRoles } = api.account.getRoles.useQuery({ accountId });
  const { data: account } = api.account.get.useQuery({ accountId });
  const { data: self } = api.user.getSelf.useQuery();
  const { mutateAsync: deleteRole } = api.membership.delete.useMutation();
  const [viewers, setViewers] = useState<User[]>([]);

  useEffect(() => {
    if (roles) {
      const newViewers = roles?.filter(e => e.access === "viewer").map(e => e.user);
      setViewers(newViewers);
    }
  }, [roles]);

  if (!roles || !self || !account) {
    return (
      <CardLoading />
    )
  }

  if (viewers.length === 0) {
    return (
      <CardNoItem>No viewers</CardNoItem>
    )
  }

  return (
    <ul>
      {
        viewers.map((viewer) => (
          <CardLi key={viewer.id}>
            <div>{`${viewer.name} (${viewer.email})`}</div>

            {access === "admin" && (
              <button
                className="text-xl"
                onClick={async () => {
                  if (!account) {
                    return;
                  }

                  if (confirm(`Are you sure you want to delete ${viewer.name} (${viewer.email}) as viewer of account ${account.name}?`)) {
                    try {
                      await deleteRole({
                        userId: viewer.id,
                        accountId: account.id
                      })
                      toast.success('Viewer deleted');
                      getRoles();
                    } catch (e) { }
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
