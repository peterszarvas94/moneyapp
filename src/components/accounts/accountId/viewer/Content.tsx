import AdminList from "./AdminList";
import ViewerList from "./ViewerList";
import EventList from "./EventList";
import AccountDetails from "../AccountDetails";

function ViewerContent() {
  return (
    <>
      <AccountDetails />
      <AdminList />
      <ViewerList />
      <EventList />
    </>
  )
}

export default ViewerContent;
