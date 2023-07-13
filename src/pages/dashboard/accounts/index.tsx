import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import DashBoardNav from "~/components/DashBoardNav";
import Redirect from "~/components/Redirect";
import useCheckUserLoaded from "~/hooks/useCheckUserLoaded";
import { api } from "~/utils/api";

const Accounts: NextPage = () => {
  const { user, checked } = useCheckUserLoaded();
  if (!checked) {
    return (
      <div>
        Loading...
      </div>
    );
  }
  if (!user) {
    return (
      <Redirect url='/,' />
    );
  }
  return (
    <UserIsLoaded clerkId={user.id}/>
  )
}

interface UserIsLoadedProps {
  clerkId: string;
}
function UserIsLoaded({ clerkId }: UserIsLoadedProps) {
  const { data: adminAccounts } = api.accountAdmin.getAccountsForAdminByClerkId.useQuery({
    clerkId
  });

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
            <div>
              My administrated accounts:
            </div>
            <ul>
              {adminAccounts?.map((account) => (
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
