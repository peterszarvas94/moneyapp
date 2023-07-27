import Link from "next/link";
import { useContext, useEffect } from "react";
import Nav from "~/components/Nav";
import Spinner from "~/components/Spinner";
import { AppContext } from "~/context/app";
import AdminList from "./AdminList";
import ViewerList from "./ViewerList";
import EventList from "./EventList";
import AccountDetails from "./AccountDetails";

function AdminContent() {
  const { account, refetch, } = useContext(AppContext);

  useEffect(() => {
    refetch();
  }, [account])

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Account {account.id}</h1>
      <Nav />

      <AdminList />
      <Link
        className="underline"
        href={`/dashboard/accounts/${account.id}/admins/new`}
      >
        Add new admin
      </Link>

      <ViewerList />
      <Link
        className="underline"
        href={`/dashboard/accounts/${account.id}/viewers/new`}
      >
        Add new viewer
      </Link>

      <AccountDetails />

      <EventList />
      <Link
        className="underline"
        href={`/dashboard/accounts/${account.id}/events/new`}
      >
        Add new event
      </Link>
    </>
  )
}

export default AdminContent;
