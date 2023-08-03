import Nav from "~/components/Nav";
import Spinner from "~/components/Spinner";
import AdminList from "./AdminList";
import ViewerList from "./ViewerList";
import EventList from "./EventList";
import { useContext } from "react";
import { AccountContext } from "~/context/account";

function ViewerContent() {
  const { accountId } = useContext(AccountContext);

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are viewer of Account {accountId}</h1>
      <Nav />
      <AdminList />
      <ViewerList />
      <EventList />
    </>
  )
}

export default ViewerContent;
