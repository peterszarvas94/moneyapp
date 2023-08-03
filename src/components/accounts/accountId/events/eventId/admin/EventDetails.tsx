import { useContext } from "react";
import { Spinner } from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import { EventContext } from "~/context/event";
import { api } from "~/utils/api";

function EventDetails() {
  const { eventId } = useContext(EventContext);
  const { accountId } = useContext(AccountContext);
  const { data: event } = api.event.get.useQuery({ eventId, accountId });

  if (!event) {
    return (
      <Spinner />
    )
  }

  return (
    <div>
      <div className="pt-6 italic">Event details:</div>
      <ul>
        <li>Event name: {event.name}</li>
        <li>Event description: {event.description}</li>
      </ul>
    </div>
  )
}

export default EventDetails;
