import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import DashBoardNav from "~/components/DashBoardNav";
import Redirect from "~/components/Redirect";
import Spinner from "~/components/Spinner";
import useCheckUserLoaded from "~/hooks/useCheckUserLoaded";
import { api } from "~/utils/api";

const Accounts: NextPage = () => {
  const { user, checked } = useCheckUserLoaded();
  if (!checked) {
    return (
      <Spinner />
    );
  }
  if (!user) {
    return (
      <Redirect url='/,' />
    );
  }
  return (
    <UserIsLoaded clerkId={user.id} />
  )
}

interface UserIsLoadedProps {
  clerkId: string;
}
function UserIsLoaded({ clerkId }: UserIsLoadedProps) {
  const { data: adminAccounts } = api.accountAdmin.getAccountsForAdmin.useQuery({
    clerkId
  });

  if (!adminAccounts) {
    return (
      <Spinner />
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
        <div>
          <h1 className='text-3xl'>This is Accounts</h1>

          <DashBoardNav />

          <div className='flex flex-col pt-6 gap-2'>
            <Link
              href='/dashboard/accounts/new'
              className='underline'
            >
              New account
            </Link>
            {adminAccounts.length === 0 ? (
              <div className="pt-4">
                You are not administrating any accounts.
              </div>
            ) : (
              <div className="pt-4">
                My administrated accounts:
              </div>
            )}
            <ul>
              {adminAccounts.map((account) => (
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
          </div>
        </div>
      </main>
    </>
  )
}

export default Accounts;
