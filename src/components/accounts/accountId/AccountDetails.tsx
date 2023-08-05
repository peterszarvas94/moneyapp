import { useContext } from "react";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardTitle from "~/components/CardTitle";
import Skeleton from "~/components/Skeleton";
import { AccountContext } from "~/context/account";
import { api } from "~/utils/api";

function AccountDetails() {
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });

  if (!account) {
    return (
      <Skeleton />
    )
  }

  return (
    <Card>
      <CardTitle title="Account Details" />
      <ul>
        <CardLi>Name: {account.name}</CardLi>
        <CardLi>Description: {account.description ?? "-"}</CardLi>
        <CardLi>Currency: {account.currency}</CardLi>
      </ul>
    </Card>
  )
}

export default AccountDetails;
