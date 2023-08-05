import Link from "next/link";
import { useContext } from "react";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import Skeleton from "~/components/Skeleton";
import { AccountContext } from "~/context/account";
import { EventContext } from "~/context/event";
import { api } from "~/utils/api";

function PayemntList() {

  return (
    <Card>
      <CardTitle title="Payments" />
      <List />
    </Card>
  )
}

export default PayemntList;

function List() {
  const { eventId } = useContext(EventContext);
  const { accountId } = useContext(AccountContext);
  const { data: payments } = api.event.getPayments.useQuery({ eventId, accountId });

  if (!payments) {
    return (
      <Skeleton />
    )
  }

  if (payments.length === 0) {
    return (
      <CardNoItem>No payments</CardNoItem>
    )
  }

  return (
    <ul>
      {payments.map(payment => (
        <CardLi key={payment.id}>
          <Link href={`/account/${accountId}/payments/${payment.id}`}>
            {payment.id}
          </Link>
        </CardLi>
      ))}
    </ul>
  )
}
