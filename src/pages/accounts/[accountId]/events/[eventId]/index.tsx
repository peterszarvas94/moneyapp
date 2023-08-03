import type { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import AdminContent from "~/components/accounts/accountId/events/eventId/admin/Content";
import { AccountContext } from "~/context/account";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { api } from "~/utils/api";

const EventPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Page />
      </main>
    </>
  );
}

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
