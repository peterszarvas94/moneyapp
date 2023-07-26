import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import Skeleton from "~/components/Skeleton";
import { AppContext } from "~/context/app";
import { api } from "~/utils/api";

function ViewerList() {
  return (
    <>
      <div className="pt-6 italic">Viewers of this account:</div>
      <List />
    </>
  )
}

function List() {
  const router = useRouter();
  const { account, user: self } = useContext(AppContext);
  const { data: viewers, refetch: getViewers } = api.account.getViewers.useQuery({ accountId: account?.id });
  const { mutateAsync: deleteViewer } = api.viewer.delete.useMutation();

  if (!viewers) {
    return (
      <Skeleton />
    )
  }

  if (viewers.length === 0) {
    return (
      <div>No viewers</div>
    )
  }

  return (
    <ul>
      {
        viewers.map((viewer) => (
          <li key={viewer.id} className="flex items-center">
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

                  if (self && self.id === viewer.id) {
                    router.push("/dashboard/accounts");
                  }
                }
              }}
            >
              <TiDelete />
            </button>
          </li>
        ))
      }
    </ul>
  )
}

export default ViewerList;
