import { useContext } from "react";
import Nav from "~/components/Nav";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import { EventContext } from "~/context/event";
import useEventIdParser from "~/hooks/useEventIdParser";
import { api } from "~/utils/api";
import EventDetails from "./EventDetails";

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
  const { accountId } = useContext(AccountContext);
  const { eventId } = useContext(EventContext);
  const { data: event, error } = api.event.get.useQuery({ eventId, accountId });

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <NoAccess />
    )
  }

  if (!event) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h2 className='text-3xl'>Event page for {event.id}</h2>
      <Nav />
      <EventDetails />
    </>
  )
}

export default AdminContent;
