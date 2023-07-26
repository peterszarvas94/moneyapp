import type { NextPage } from "next";
import Head from "next/head";
import NoAccess from "~/components/NoAccess";
import useAccountCheckAccess from "~/hooks/useAccountCheckAccess";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import AdminContent from "~/components/accounts/accountId/admin/Content";
import ViewerContent from "~/components/accounts/accountId/viewer/Content";

const AccountPage: NextPage = () => {
  useAccountIdParser();
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
  const { adminAccess, viewerAccess } = useAccountCheckAccess();
  if (adminAccess) {
    return (
      <AdminContent />
    )
  }

  if (viewerAccess) {
    return (
      <ViewerContent />
    )
  }

  return (
    <NoAccess />
  )
}

export default AccountPage;
