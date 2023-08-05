import type { NextPage } from "next";
import { useContext } from "react";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import NoAccess from "~/components/NoAccess";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import AdminContent from "~/components/accounts/accountId/events/eventId/admin/Content";
import { AccountContext } from "~/context/account";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { api } from "~/utils/api";

const EventPage: NextPage = () => (
  <>
    <HeadElement title="Event - Moneyapp" description="Split the money" />
    <Header />
    <PageTitle title="Admnistrate Event" />
    <main>
      <Page />
    </main>
  </>
)

export default EventPage;

function Page() {
  const { accountId } = useAccountIdParser();

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId }}>
      <IdParsed />
    </AccountContext.Provider>
  )
}

function IdParsed() {
  const { accountId } = useContext(AccountContext);
  const { data: access, error } = api.account.getAccess.useQuery({ accountId });

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <NoAccess />
    )
  }

  if (access === "admin") {
    return (
      <AdminContent />
    )
  }

  if (access === "viewer") {
    return (
      <ViewerContent />
    )
  }

  return (
    <Spinner />
  )
}

function ViewerContent() {
  return (
    <div>
      Viewer
    </div>
  )
}
