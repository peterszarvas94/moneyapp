import { api } from "~/utils/api";
import Card from "../Card";
import CardTitle from "../CardTitle";
import CardLink from "../CardLink";
import CardNoItem from "../CardNoItem";
import CardLoading from "../CardLoading";

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
      <CardLoading />
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
        <CardLink
          key={account.id}
          url={`/accounts/${account.id}`}
          text={account.name}
        />
      ))}
    </ul>
  )
}

export default AdminContent;
