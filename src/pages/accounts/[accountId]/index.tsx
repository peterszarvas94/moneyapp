import type { NextPage } from "next";
import Head from "next/head";
import NoAccess from "~/components/NoAccess";
import AdminContent from "~/components/accounts/accountId/admin/Content";
import ViewerContent from "~/components/accounts/accountId/viewer/Content";
import { api } from "~/utils/api";
import Spinner from "~/components/Spinner";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { AccountContext } from "~/context/account";
import { useContext } from "react";

const AccountPage: NextPage = () => {
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

function Page() {
  const { accountId } = useAccountIdParser();

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <AccountContext.Provider value={{accountId}}>
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

export default AccountPage;
