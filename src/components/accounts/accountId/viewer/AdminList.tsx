import { useContext } from "react";
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
  const { data: admins } = api.account.getAdmins.useQuery({ accountId });

  if (!admins) {
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
          </CardLi>
        ))
      }
    </ul>
  )
}

export default AdminList;
