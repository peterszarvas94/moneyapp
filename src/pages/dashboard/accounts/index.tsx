import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import DashBoardNav from "~/components/DashBoardNav";
import Redirect from "~/components/Redirect";
import Skeleton from "~/components/Skeleton";
import Spinner from "~/components/Spinner";
import useCheckUserLoaded from "~/hooks/useCheckUserLoaded";
import { Account } from "~/server/db/schema";
import { api } from "~/utils/api";

const Accounts: NextPage = () => {
  const { user, checked } = useCheckUserLoaded();
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!checked ? (
          <Spinner />
        ) : (
          <Page user={user ? user.id : undefined} />
        )}
      </main>
    </>
  )
}

interface PageProps {
  user?: string;
}
function Page({ user }: PageProps) {
  if (user) {
    return (
      <UserIsLoaded clerkId={user} />
    )
  }

  return (
    <Redirect url='/' />
  )
}

interface UserIsLoadedProps {
  clerkId: string;
}
function UserIsLoaded({ clerkId }: UserIsLoadedProps) {
  const { data: user } = api.user.getByClerkId.useQuery({ clerkId });
  const { data: adminAccounts } = api.accountAdmin.getAccountsForAdmin.useQuery({ id: user?.id });
  const { data: viewerAccounts } = api.accountViewer.getAccountsForViewer.useQuery({ id: user?.id });


  return (
    <div>
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
    </div>
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


export default Accounts;
