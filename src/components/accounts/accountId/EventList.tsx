import Event from "~/components/accounts/accountId/Event";
import Spinner from "~/components/Spinner";
import { useAccountContext } from "~/context/account";
import AddButton from "./AddButton";
import NewEvent from "./NewEvent";
import { EventListProvider, useEventListContext } from "~/context/eventlist";
import { api } from "~/utils/api";

function EventList() {
  return (
    <div className="px-4 pt-4">
      <EventListProvider>
        <Content />
      </EventListProvider>
    </div>
  )
}

function Content() {
  const { access } = useAccountContext();
  const { adding, setAdding } = useEventListContext();
  const { accountId } = useAccountContext();
  const { data: events, refetch } = api.account.getEvents.useQuery({ accountId });

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
            event={event}
            refetch={refetch}
          />
        ))}
        {access === "admin" && adding && (
          <NewEvent />
        )}
      </ul>
      {access === "admin" && !adding && (
        <div className="pt-4 flex justify-center">
          <AddButton
            text="New event"
            onClick={() => setAdding(true)}
          />
        </div>
      )}
    </>
  )
}

export default EventList;
