import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Head from "next/head";

import type { Access } from "~/hooks/useCheckAccess";
import Redirect from "~/components/Redirect";
import DashBoardNav from "~/components/DashBoardNav";
import Spinner from "~/components/Spinner";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import usePageLoader from "~/hooks/usePageLoader";
import Skeleton from "~/components/Skeleton";

const AccountPage: NextPage = () => {
  const { access, checked, id } = usePageLoader();
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!checked || !id ? (
          <Spinner />
        ) : (
          <Page access={access} id={id} />
        )}
      </main>
    </>
  );
}

interface PageProps {
  access: Access;
  id: number;
}
function Page({ access, id }: PageProps) {
  if (access === "admin") {
    return (
      <AdminAccountContent id={id} />
    )
  }

  return (
    <Redirect url="/dashboard/accounts/" />
  )
}

interface AdminAccountContentProps {
  id: number;
}
function AdminAccountContent({ id }: AdminAccountContentProps) {
  const { data: account } = api.account.get.useQuery({ id });
  const { mutateAsync: deleteAccountAdmin } = api.accountAdmin.delete.useMutation();
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation();
  const { data: admins } = api.accountAdmin.getAdminsForAccount.useQuery({ accountId: id });
  const router = useRouter();
  const { user } = useUser();

  function renderAdmins() {
    return (
      <>
        <div className="pt-6 italic">Admins of this account:</div>
        <ul>
          {!admins || !user ? (
            <li>
              <Skeleton />
            </li>
          ) : (
            <>
              {
                admins.map((admin) => (
                  <li key={admin.id}>
                    {`${admin.name} (${admin.email})`}
                  </li>
                ))
              }
            </>
          )}
        </ul>
        <Link
          className="underline"
          href={`/dashboard/accounts/${id}/admins/new`}
        >
          Add new admin
        </Link>
      </>
    )
  }

  function renderDetails() {
    return (
      <>
        <div className="pt-6 italic">Account details:</div>
        <ul>
          {!account || !user ? (
            <li>
              <Skeleton />
            </li>
          ) : (
            <li>
              {`Name: ${account.name}`}
            </li>
          )}
          {!account || !user ? (
            <li>
              <Skeleton />
            </li>
          ) : (
            <li>
              {`Description: ${account.description}`}
            </li>
          )}
          <li>
            <Link
              href={`/dashboard/accounts/${id}/edit`}
              className="underline"
            >
              Edit
            </Link>
          </li>
          <li>
            <button
              className="underline"
              onClick={async () => {
                if (!user) return;

                if (confirm("Are you sure?")) {
                  try {
                    await deleteAccountAdmin({
                      clerkId: user.id,
                      accountId: id,
                    })
                  } catch (e) {
                    return;
                  }

                  try {
                    const success = await deleteAccount({ id })
                    if (success) {
                      toast.success("Account deleted");
                      router.push("/dashboard/accounts");
                    }
                  } catch (e) {
                    return;
                  }
                }
              }}
            >
              Delete
            </button>
          </li>
        </ul>
      </>
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Account {id}</h1>
      <DashBoardNav />
      {renderAdmins()}
      {renderDetails()}
    </>
  )
}

export default AccountPage;
