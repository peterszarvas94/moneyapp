import Event from "~/components/accounts/accountId/Event";
import AddButton from "~/components/AddButton";
import Spinner from "~/components/Spinner";
import { useAccountContext } from "~/context/account";
import { api } from "~/utils/api";

function EventList() {
  return (
    <div className="px-4 pt-4">
      <List />
    </div>
  )
}

function List() {
  const { accountId, access } = useAccountContext();
  const { data: events } = api.account.getEvents.useQuery({ accountId });

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
      </ul>
      {access === "admin" && (
        <div className="pt-4 flex justify-center">
          <AddButton url={`/accounts/${accountId}/events/new`} text="New event" />
        </div>
      )}
    </>
  )
}

export default EventList;
