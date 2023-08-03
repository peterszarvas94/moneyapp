import Link from "next/link";
import { useContext } from "react";
import Card from "~/components/Card";
import CardLink from "~/components/CardLink";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import Skeleton from "~/components/Skeleton";
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
      <Skeleton />
    )
  }

  if (events.length === 0) {
    return (
      <CardNoItem>No events</CardNoItem>
    )
  }

  return (
    <ul>
      {
        events.map((event) => (
          <li key={event.id} className="flex items-center">
            <CardLink url={`/accounts/${accountId}/events/${event.id}`}>
              {event.name}
            </CardLink>
          </li>
        ))
      }
    </ul>
  )
}

export default EventList;
