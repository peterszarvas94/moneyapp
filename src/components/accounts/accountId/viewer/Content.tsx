import Nav from "~/components/Nav";
import Spinner from "~/components/Spinner";
import AdminList from "./AdminList";
import ViewerList from "./ViewerList";
import EventList from "./EventList";
import { AppContext } from "~/context/app";
import { useContext } from "react";

function ViewerContent() {
  const { account } = useContext(AppContext);

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are viewer of Account {account.id}</h1>
      <Nav />
      <AdminList />
      <ViewerList />
      <EventList />
    </>
  )
}

export default ViewerContent;
