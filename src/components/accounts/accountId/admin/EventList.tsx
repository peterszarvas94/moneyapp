import Link from "next/link";
import { useContext } from "react";
import Skeleton from "~/components/Skeleton";
import { AppContext } from "~/context/app";
import { api } from "~/utils/api";

function EventList() {
  return (
    <>
      <div className="pt-6 italic">Events of this account:</div>
      <List />
    </>
  )
}

function List() {
  const { account } = useContext(AppContext);
  const { data: events } = api.account.getEvents.useQuery({ accountId: account?.id });

  if (!events || !account) {
    return (
      <Skeleton />
    )
  }

  if (events.length === 0) {
    return (
      <div>
        No events
      </div>
    )
  }

  return (
    <ul>
      {
        events.map((event) => (
          <li key={event.id} className="flex items-center">
            <Link
              className="underline"
              href={`/dashboard/accounts/${account.id}/events/${event.id}`}
            >
              {event.name}
            </Link>
          </li>
        ))
      }
    </ul>
  )
}

export default EventList;
