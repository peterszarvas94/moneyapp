import type { NextPage } from "next";
import type { Access } from "~/hooks/useCheckAccess";
import useAccountAccessCheck from "~/hooks/useCheckAccess";
import useParseId from "~/hooks/useParseId";
import Link from "next/link";
import Head from "next/head";
import Redirect from "~/components/Redirect";
import DashBoardNav from "~/components/DashBoardNav";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Spinner from "~/components/Spinner";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { parsedId } = useParseId({ id });
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!parsedId ? (
          <Spinner />
        ) : (
          <IdIsParsed id={parsedId} />
        )}
      </main>
    </>
  );
}

interface IdIsParsedProps {
  id: number;
}
function IdIsParsed({ id }: IdIsParsedProps) {
  const { access, checked } = useAccountAccessCheck({ accountId: id });
  return (
    <>
      {!checked ? (
        <Spinner />
      ) : (
        <AccessIsChecked access={access} id={id} />
      )}
    </>
  )
}

interface AccessIsChecked {
  access: Access;
  id: number;
}
function AccessIsChecked({ access, id }: AccessIsChecked) {
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
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return <Redirect url="/" />
  }

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Account {id}</h1>
      <DashBoardNav />
      <ul className="pt-6">
        <li>Name: {account.name}</li>
        <li>Description: {account.description}</li>
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

export default AccountPage;
