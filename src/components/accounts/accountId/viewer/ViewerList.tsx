import { useContext } from "react";
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
  const { account } = useContext(AppContext);
  const { data: viewers } = api.account.getViewers.useQuery({ accountId: account?.id });

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
            {`${viewer.name} (${viewer.email})`}
          </li>
        ))
      }
    </ul>
  )
}

export default ViewerList;
