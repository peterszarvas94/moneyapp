import { useContext } from "react";
import Nav from "~/components/Nav";
import Spinner from "~/components/Spinner";
import { AppContext } from "~/context/app";

function AdminContent() {
  const { event } = useContext(AppContext);

  if (!event) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Event {event.id}</h1>
      <Nav />
    </>
  )
}

export default AdminContent;
