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
  const { data: adminAccounts } = api.accountAdmin.getAccountsForAdmin.useQuery({
    clerkId
  });

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
            <AccountList accounts={adminAccounts} />
          )}
        </div>
      </div>
    </div>
  )
}

interface AccountListProps {
  accounts: Account[];
}
function AccountList({ accounts }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div>
        You are not an admin of any accounts.
      </div>
    )
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

export default Accounts;
