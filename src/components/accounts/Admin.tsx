import { api } from "~/utils/api";
import Skeleton from "../Skeleton";
import CardTitle from "../CardTitle";
import CardLink from "../CardLink";
import CardNoItem from "../CardNoItem";
import Card from "../Card";

function AdminContent() {
  return (
    <Card>
      <CardTitle title="Administrated" />
      <List />
    </Card>
  )
}

function List() {
  const { data: accounts } = api.admin.getAccounts.useQuery();

  if (!accounts) {
    return (
      <Skeleton />
    )
  }

  if (accounts.length === 0) {
    return (
      <CardNoItem>No administrated accounts.</CardNoItem>
    )
  }

  return (
    <ul>
      {accounts.map((account) => (
        <li key={account.id}>
          <CardLink
            url={`/accounts/${account.id}`}
          >
            {account.name}
          </CardLink>
        </li>
      ))}
    </ul>
  )
}

export default AdminContent;
