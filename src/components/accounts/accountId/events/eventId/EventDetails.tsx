import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardLoading from "~/components/CardLoading";
import CardTitle from "~/components/CardTitle";
import { useAccountContext } from "~/context/account";
import { useEventContext } from "~/context/event";
import { api } from "~/utils/api";
import { parseDate } from "~/utils/date";

function EventDetails() {
  return (
    <div className="px-4 pt-4">
      <Card>
        <CardTitle title="Event details" />
        <Details />
      </Card>
    </div >
  )
}

function Details() {

  const { accountId } = useAccountContext();
  const { eventId } = useEventContext();
  const { data: event } = api.event.get.useQuery({ accountId, eventId });

  if (!event) {
    return (
      <ul>
        <li><CardLoading /></li>
        <li><CardLoading /></li>
        <li><CardLoading /></li>
        <li><CardLoading /></li>
        <li><CardLoading /></li>
      </ul>
    )
  }

  const deliveryStr = parseDate(event.delivery);

  return (
    <ul>
      <CardLi>Name: {event.name}</CardLi>
      <CardLi>Description: {event.description ?? "-"}</CardLi>
      <CardLi>Delivery date: {deliveryStr}</CardLi>
      <CardLi>Income: {event.income}</CardLi>
      <CardLi>Saving: {event.saving}</CardLi>
    </ul>
  )
}

export default EventDetails;
