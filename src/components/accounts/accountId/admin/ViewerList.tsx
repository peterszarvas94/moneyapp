import { useRouter } from "next/router";
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

function ViewerList() {
  return (
    <Card>
      <CardTitle title="Viewers" />
      <List />
    </Card>
  )
}

function List() {
  const { accountId } = useContext(AccountContext);
  const { data: viewers, refetch: getViewers } = api.account.getViewers.useQuery({ accountId });
  const { data: account } = api.account.get.useQuery({ accountId });
  const { mutateAsync: deleteViewer } = api.viewer.delete.useMutation();

  if (!viewers) {
    return (
      <Skeleton />
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
            <button
              className="text-xl"
              onClick={async () => {
                if (!account) {
                  return;
                }

                if (confirm(`Are you sure you want to delete ${viewer.name} (${viewer.email}) as viewer of account ${account.name}?`)) {
                  try {
                    await deleteViewer({
                      userId: viewer.id,
                      accountId: account.id
                    })
                    toast.success('Viewer deleted');
                    getViewers();
                  } catch (e) { }
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

export default ViewerList;
