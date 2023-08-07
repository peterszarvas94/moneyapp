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
    <Card>
      <CardTitle title="Events" />
      <List />
    </Card>
  )
}

function List() {
  const { accountId } = useContext(AccountContext);
  const { data: events } = api.account.getEvents.useQuery({ accountId });

  if (!events) {
    return (
      <CardLoading />
    )
  }

  if (events.length === 0) {
    return (
      <CardNoItem>No events</CardNoItem>
    )
  }

  return (
    <ul>
      {events.map((event) => (
        <CardLink
          key={event.id}
          url={`/accounts/${accountId}/events/${event.id}`}
          text={event.name}
        />
      ))}
    </ul>
  )
}

export default EventList;
