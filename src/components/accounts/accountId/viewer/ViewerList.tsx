import { useContext } from "react";
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
  const { data: viewers } = api.account.getViewers.useQuery({ accountId });

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
          </CardLi>
        ))
      }
    </ul>
  )
}

export default ViewerList;
