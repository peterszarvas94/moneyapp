import Event from "~/components/accounts/accountId/Event";
import Spinner from "~/components/Spinner";
import { useAccountContext } from "~/context/account";
import { api } from "~/utils/api";
import AddButton from "./AddButton";
import NewEvent from "./NewEvent";
import { EventListProvider, useEventListContext } from "~/context/eventlist";

function EventList() {
  const { accountId } = useAccountContext();

  return (
    <div className="px-4 pt-4">
      <EventListProvider accountId={accountId}>
        <Content />
      </EventListProvider>
    </div>
  )
}

function Content() {
  const { access } = useAccountContext();
  const { adding, setAdding, events } = useEventListContext();

  if (!events) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div>No events</div>
    )
  }

  return (
    <>
      <ul>
        {events.map((event) => (
          <Event
            key={event.id}
            eventId={event.id}
          />
        ))}
        {access === "admin" && adding && (
          <NewEvent />
        )}
      </ul>
      {access === "admin" && !adding && (
        <div className="pt-4 flex justify-center">
          <AddButton
            onClick={() => setAdding(true)}
          />
        </div>
      )}
    </>
  )
}

export default EventList;
