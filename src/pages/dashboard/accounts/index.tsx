import { useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import DashBoardNav from "~/components/DashBoardNav";
import { api } from "~/utils/api";

const Accounts: NextPage = () => {

  const { user } = useUser();
  const { data: userId } = api.user.getByClerkId.useQuery({ clerkId: user?.id });
  const { data: accounts } = api.accountAdmin.getAccountsByAdminId.useQuery({ adminId: userId?.id });

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
            <ul>
              {accounts?.map((account) => (
                <li key={account.account.id}>
                  {account.account.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}

export default Accounts;
