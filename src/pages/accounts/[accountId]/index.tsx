import type { NextPage } from "next";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import usePageLoader from "~/hooks/usePageLoader";
import Content from "~/components/accounts/accountId/Content";

const AccountPage: NextPage = () => (
  <>
    <HeadElement title="Account - Moneyapp" description="Split the money" />
    <Header />
    <main>
      <Page />
    </main>
  </>
)

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

export default AccountPage;
