import { useContext } from "react";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardTitle from "~/components/CardTitle";
import NoAccess from "~/components/NoAccess";
import { Spinner } from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import { EventContext } from "~/context/event";
import { api } from "~/utils/api";
import { parseDate } from "~/utils/date";

function EventDetails() {
  const { accountId } = useContext(AccountContext);
  const { eventId } = useContext(EventContext);
  const { data: event, error } = api.event.get.useQuery({ eventId, accountId });

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <NoAccess />
    )
  }

  if (!event) {
    return (
      <Spinner />
    )
  }

  const deliveryStr = parseDate(event.delivery);

  return (
    <Card>
      <CardTitle title="Event details" />
      <ul>
        <CardLi>Name: {event.name}</CardLi>
        <CardLi>Description: {event.description ?? "-"}</CardLi>
        <CardLi>Delivery date: {deliveryStr}</CardLi>
        <CardLi>Income: {event.income}</CardLi>
        <CardLi>Saving: {event.saving}</CardLi>
      </ul>
    </Card>
  )
}

export default EventDetails;
