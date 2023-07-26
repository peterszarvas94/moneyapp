import { UserButton } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import Nav from "~/components/Nav";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1 className='text-3xl'>This is Dashboard</h1>
          <Nav />
          <div className='flex flex-col pt-6'>
            <UserButton />
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard;
