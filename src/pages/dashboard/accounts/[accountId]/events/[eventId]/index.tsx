import type { NextPage } from "next";
import Head from "next/head";
import NoAccess from "~/components/NoAccess";
import AdminContent from "~/components/accounts/accountId/events/eventId/admin/Content";
import useAccountCheckAccess from "~/hooks/useAccountCheckAccess";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import useEventIdParser from "~/hooks/useEventIdParser";

const EventPage: NextPage = () => {
  useAccountIdParser();
  useEventIdParser();
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

function ViewerContent() {
  return (
    <div>
      Viewer
    </div>
  )
}
