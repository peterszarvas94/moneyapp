import Card from "~/components/Card";
import CardLink from "~/components/CardLink";
import CardLoading from "~/components/CardLoading";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import { useAccountContext } from "~/context/account";
import { useEventContext } from "~/context/event";
import { api } from "~/utils/api";

function PayemntList() {

  return (
    <div className="px-4 pt-4">
      <Card>
        <CardTitle title="Payments" />
        <List />
      </Card>
    </div>
  )
}

export default PayemntList;

function List() {
  const { accountId } = useAccountContext();
  const { eventId } = useEventContext();;
  const { data: payments } = api.event.getPayments.useQuery({ eventId, accountId });

  if (!payments) {
    return (
      <CardLoading />
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
        <CardLink
          key={payment.id}
          url={`/account/${accountId}/payments/${payment.id}`}
          text={payment.id.toString()}
        />
      ))}
    </ul>
  )
}
