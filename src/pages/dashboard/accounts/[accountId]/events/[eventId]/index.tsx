import type { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import Nav from "~/components/Nav";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AppContext } from "~/context/app";
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

function AdminContent() {
  const { event } = useContext(AppContext);

  if (!event) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Event {event.id}</h1>
      <Nav />
    </>
  )
}

function ViewerContent() {
  return (
    <div>
      Viewer
    </div>
  )
}
