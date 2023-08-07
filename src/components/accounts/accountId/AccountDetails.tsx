import { useContext } from "react";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardLoading from "~/components/CardLoading";
import CardTitle from "~/components/CardTitle";
import { AccountContext } from "~/context/account";
import { api } from "~/utils/api";

function AccountDetails() {
  return (
    <Card>
      <CardTitle title="Account Details" />
      <Details />
    </Card>
  )
}

function Details() {
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });

  if (!account) {
    return (
      <ul>
        <li><CardLoading /></li>
        <li><CardLoading /></li>
        <li><CardLoading /></li>
      </ul>
    )
  }

  return (
    <ul>
      <CardLi>Name: {account.name}</CardLi>
      <CardLi>Description: {account.description ?? "-"}</CardLi>
      <CardLi>Currency: {account.currency}</CardLi>
    </ul>
  )
}

export default AccountDetails;
