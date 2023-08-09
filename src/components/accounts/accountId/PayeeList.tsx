import { useContext } from "react";
import Card from "~/components/Card";
import CardLink from "~/components/CardLink";
import CardLoading from "~/components/CardLoading";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import { AccountContext } from "~/context/account";
import { api } from "~/utils/api";

function EventList() {
  return (
    <div className="px-4 pt-4">
      <Card>
        <CardTitle title="Payees" />
        <List />
      </Card>
    </div>
  )
}

function List() {
  const { accountId } = useContext(AccountContext);
  const { data: payees } = api.account.getPayees.useQuery({ accountId });

  if (!payees) {
    return (
      <CardLoading />
    )
  }

  if (payees.length === 0) {
    return (
      <CardNoItem>No payees</CardNoItem>
    )
  }

  return (
    <ul>
      {payees.map((payee) => (
        <CardLink
          key={payee.id}
          url={`/accounts/${accountId}/payees/${payee.id}`}
          text={payee.name}
        />
      ))}
    </ul>
  )
}

export default EventList;
