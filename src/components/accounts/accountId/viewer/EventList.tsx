import { useContext } from "react";
import Skeleton from "~/components/Skeleton";
import { AccountContext } from "~/context/account";
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
  const { accountId } = useContext(AccountContext);
  const { data: events } = api.account.getEvents.useQuery({ accountId });

  if (!events) {
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
            <div>{event.name}</div>
          </li>
        ))
      }
    </ul>
  )
}

export default EventList;
