import { useContext } from "react";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardLoading from "~/components/CardLoading";
import CardTitle from "~/components/CardTitle";
import { AccountContext } from "~/context/account";
import { EventContext } from "~/context/event";
import { api } from "~/utils/api";
import { parseDate } from "~/utils/date";

function EventDetails() {
  return (
    <Card>
      <CardTitle title="Event details" />
      <Details />
    </Card>
  )
}

function Details() {

  const { accountId } = useContext(AccountContext);
  const { eventId } = useContext(EventContext);
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