import type { NextPage } from "next";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useRouter } from "next/router";
import { useState } from "react";
import { EventContext, useEventContext } from "~/context/event";
import useIdParser from "~/hooks/useIdParser";
import { api } from "~/utils/api";
import EditButton from "~/components/EditButton";
import DeleteButton from "~/components/DeleteButton";
import toast from "react-hot-toast";
import Spinner from "~/components/Spinner";
import { useAccountContext } from "~/context/account";
import PageTitle from "~/components/PageTitle";
import EventDetails from "~/components/accounts/accountId/events/eventId/EventDetails";
import PayemntList from "~/components/accounts/accountId/events/eventId/PaymentList";
import BackButton from "~/components/BackButton";
import AddButton from "~/components/AddButton";

const EventPage: NextPage = () => {

  return (
    <AccessedPage title="Event - Moneyapp" accessible="viewer" >
      <Content />
    </AccessedPage>
  )
}

export default EventPage;

function Content() {
  const { parsedId: eventId } = useIdParser("eventId");
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
  const { eventId } = useEventContext();
  const { accountId, access } = useAccountContext();
  const { mutateAsync: deleteEvent } = api.event.delete.useMutation();
  const [deleting, setDeleting] = useState<boolean>(false);

  return (
    <>
      <PageTitle title={access === "admin" ? "Administrate Event" : "View Event"} />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>
      <EventDetails />

      {access === "admin" && !deleting && (
        <div className="flex pt-4 justify-center gap-2">
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
        <div className="flex pt-5 pb-1 justify-center py-1">
          <Spinner />
        </div>
      )}

      <PayemntList />

      {access === "admin" && (
        <div className="flex justify-center py-4">
          <AddButton url={`/accounts/${accountId}/payments/new?eventId=${eventId}`} text="Add Payment" />
        </div>
      )}
    </>
  )
}
