import { api } from "~/utils/api";
import Skeleton from "../Skeleton";
import CardTitle from "../CardTitle";
import CardNoItem from "../CardNoItem";
import CardLink from "../CardLink";
import Card from "../Card";

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
      <Skeleton />
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

export default ViewerContent;
