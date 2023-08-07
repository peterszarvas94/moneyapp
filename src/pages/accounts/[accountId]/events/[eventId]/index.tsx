import type { NextPage } from "next";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import Content from "~/components/accounts/accountId/events/eventId/Content";
import { AccountContext } from "~/context/account";
import usePageLoader from "~/hooks/usePageLoader";

const EventPage: NextPage = () => (
  <>
    <HeadElement title="Event - Moneyapp" description="Split the money" />
    <Header />
    <main>
      <Page />
    </main>
  </>
)

export default EventPage;

function Page() {
  const { accountId, access } = usePageLoader();

  if (!accountId || !access) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  if (access === "denied") {
    return (
      <NoAccess />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId, access }}>
      <Content />
    </AccountContext.Provider>
  )
}
