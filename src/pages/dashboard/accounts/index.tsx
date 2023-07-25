import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import DashBoardNav from "~/components/DashBoardNav";
import Skeleton from "~/components/Skeleton";
import { UserContext } from "~/context/user";
import { Account } from "~/server/db/schema";
import { api } from "~/utils/api";

const AccountsPage: NextPage = () => {
  const { user } = useContext(UserContext);
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

      <DashBoardNav />

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
            <AdminAccountList accounts={adminAccounts} />
          )}
        </div>
        <div className="pt-4">
          {!viewerAccounts ? (
            <Skeleton />
          ) : (
            <ViewerAccountList accounts={viewerAccounts} />
          )}
        </div>
      </div>
    </>
  )
}

interface AdminAccountListProps {
  accounts: Account[];
}
function AdminAccountList({ accounts }: AdminAccountListProps) {
  if (accounts.length === 0) {
    return "No administrated accounts."
  }

  return (
    <>
      <div>
        My administrated accounts:
      </div>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <Link
              href={`/dashboard/accounts/${account.id}`}
              className='underline'
            >
              {account.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}


interface ViewerAccountListProps {
  accounts: Account[];
}
function ViewerAccountList({ accounts }: ViewerAccountListProps) {
  if (accounts.length === 0) {
    return "No viewed accounts."
  }

  return (
    <>
      <div>
        My viewed accounts:
      </div>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <Link
              href={`/dashboard/accounts/${account.id}`}
              className='underline'
            >
              {account.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}


export default AccountsPage;
