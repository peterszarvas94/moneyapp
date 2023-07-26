import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import Nav from "~/components/Nav";
import Skeleton from "~/components/Skeleton";
import Admin from "~/components/accounts/Admin";
import Viewer from "~/components/accounts/Viewer";
import { AppContext } from "~/context/app";
import { api } from "~/utils/api";

const AccountsPage: NextPage = () => {
  const { user } = useContext(AppContext);
  const { data: adminAccounts } = api.admin.getAccounts.useQuery({ userId: user?.id });
  const { data: viewerAccounts } = api.viewer.getAccounts.useQuery({ userId: user?.id });

  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='text-3xl'>My accounts</h1>

      <Nav />

      <div className='flex flex-col pt-6 gap-2'>
        <Link
          href='/dashboard/accounts/new'
          className='underline'
        >
          New account
        </Link>
        <div className="pt-4">
          {!adminAccounts ? (
            <Skeleton />
          ) : (
            <Admin accounts={adminAccounts} />
          )}
        </div>
        <div className="pt-4">
          {!viewerAccounts ? (
            <Skeleton />
          ) : (
            <Viewer accounts={viewerAccounts} />
          )}
        </div>
      </div>
    </>
  )
}

export default AccountsPage;
