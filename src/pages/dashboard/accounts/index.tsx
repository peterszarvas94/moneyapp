import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import DashBoardNav from "~/components/DashBoardNav";

const Accounts: NextPage = () => {
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1 className='text-3xl'>This is Accounts</h1>

          <DashBoardNav />

          <div className='flex flex-col pt-6'>
            <Link
              href='/dashboard/accounts/new'
              className='underline'
            >
              New account
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Accounts;
