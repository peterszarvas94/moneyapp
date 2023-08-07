import { api } from "~/utils/api";
import Card from "../Card";
import CardTitle from "../CardTitle";
import CardNoItem from "../CardNoItem";
import CardLink from "../CardLink";
import CardLoading from "../CardLoading";

function ViewerContent() {
  return (
    <Card>
      <CardTitle title="Viewed" />
      <List />
    </Card>
  )
}

function List() {
  const { data: accounts } = api.viewer.getAccounts.useQuery();

  if (!accounts) {
    return (
      <CardLoading />
    )
  }

  if (accounts.length === 0) {
    return (
      <CardNoItem>No viewed accounts.</CardNoItem>
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

export default ViewerContent;
