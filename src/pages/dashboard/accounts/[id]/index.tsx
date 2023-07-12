import type { NextPage } from "next";
import Head from "next/head";
import useCheckAccessToAccount from "~/hooks/useCheckAccess";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountForAdmin from "~/components/AccountForAdmin";

const AccountPage: NextPage = () => {

  // parse id from router
  const [parsedId, setParsedId] = useState<number | undefined>(undefined);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (typeof id !== "string") {
      return;
    }
    const parsed = parseInt(id);
    if (isNaN(parsed)) {
      return;
    }
    setParsedId(parsed);
  }, [id]);

  // check access to account
  const { user } = useUser();
  const { access } = useCheckAccessToAccount({
    clerkId: user?.id,
    accountId: parsedId
  });

  // fetch account
  const [isAccessChecked, setIsAccessChecked] = useState<boolean>(false);
  useEffect(() => {
    if (access !== null) {
      setIsAccessChecked(true);
    }
  }, [access]);

  // render function for page content
  function pageContent() {
    if (!isAccessChecked || !parsedId) {
      return (
        <div>
          Checking access...
        </div>
      );
    }

    if (access === "admin") {
      return (
        <AccountForAdmin id={parsedId} />
      )
    }

    // todo: redirect to account page
    return (
      <div>
        You don't have access to this page
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {pageContent()}
      </main>
    </>
  );
}

export default AccountPage;
