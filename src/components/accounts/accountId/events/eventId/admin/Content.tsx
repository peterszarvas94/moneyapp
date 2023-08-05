import Spinner from "~/components/Spinner";
import { EventContext } from "~/context/event";
import useEventIdParser from "~/hooks/useEventIdParser";
import EventDetails from "./EventDetails";
import EditButton from "~/components/EditButton";
import DeleteButton from "~/components/DeleteButton";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { api } from "~/utils/api";
import { AccountContext } from "~/context/account";
import { useRouter } from "next/router";

function AdminContent() {
  const { eventId } = useEventIdParser();

  if (!eventId) {
    return (
      <Spinner />
    )
  }

  return (
    <EventContext.Provider value={{ eventId }}>
      <IdParsed />
    </EventContext.Provider>
  )
}

function IdParsed() {
  const router = useRouter();
  const { eventId } = useContext(EventContext);
  const { accountId } = useContext(AccountContext);
  const { mutateAsync: deleteEvent } = api.event.delete.useMutation();

  return (
    <>
      <EventDetails />
      <div className="px-4 flex justify-center gap-2">
        <EditButton
          url={`/accounts/${accountId}/events/${eventId}/edit`}
          text="Edit"
        />
        <DeleteButton
          click={async () => {
            if (confirm("Are you sure?")) {
              try {
                await deleteEvent({
                  accountId,
                  eventId,
                })
                toast.success("Account deleted");
                router.push(`/accounts/${accountId}`);
              } catch (e) {
                console.log(e)
              }
            }
          }}
          text="Delete"
        />
      </div>
    </>
  )
}

export default AdminContent;
