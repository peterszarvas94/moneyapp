import { useContext } from "react";
import Skeleton from "~/components/Skeleton";
import { AccountContext } from "~/context/account";
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
  const { accountId } = useContext(AccountContext);
  const { data: viewers } = api.account.getViewers.useQuery({ accountId });

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
