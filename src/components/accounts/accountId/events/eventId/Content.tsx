import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import { EventContext } from "~/context/event";
import useEventIdParser from "~/hooks/useEventIdParser";
import { api } from "~/utils/api";
import EventDetails from "./EventDetails";
import EditButton from "~/components/EditButton";
import DeleteButton from "~/components/DeleteButton";
import toast from "react-hot-toast";
import PayemntList from "./PaymentList";
import PageTitle from "~/components/PageTitle";

function Content() {
  const { eventId } = useEventIdParser();

  if (!eventId) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
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
  const { accountId, access } = useContext(AccountContext);
  const { mutateAsync: deleteEvent } = api.event.delete.useMutation();
  const [deleting, setDeleting] = useState<boolean>(false);

  return (
    <>
      <PageTitle title={access === "admin" ? "Administrate Event" : "View Event"} />
      <EventDetails />

      {access === "admin" && !deleting && (
        <div className="flex justify-center gap-2">
          <EditButton
            url={`/accounts/${accountId}/events/${eventId}/edit`}
            text="Edit"
          />
          <DeleteButton
            click={async () => {
              if (confirm("Are you sure?")) {
                setDeleting(true);
                try {
                  await deleteEvent({
                    accountId,
                    eventId,
                  })
                  toast.success("Event deleted");
                  router.push(`/accounts/${accountId}`);
                } catch (e) {
                  toast.error("Event deletion failed");
                  setDeleting(false);
                }
              }
            }}
            text="Delete"
          />
        </div>
      )}

      {access === "admin" && deleting && (
        <div className="flex justify-center py-1">
          <Spinner />
        </div>
      )}

      <PayemntList />
    </>
  )
}

export default Content;
