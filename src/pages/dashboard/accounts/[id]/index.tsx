import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Head from "next/head";
import { TiDelete } from "react-icons/ti";
import type { Access } from "~/hooks/useCheckAccess";
import Redirect from "~/components/Redirect";
import DashBoardNav from "~/components/DashBoardNav";
import Spinner from "~/components/Spinner";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import usePageLoader from "~/hooks/usePageLoader";
import Skeleton from "~/components/Skeleton";
import { useUser } from "@clerk/nextjs";

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

  if (access === "viewer") {
    return (
      <ViewerAccountContent id={id} />
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
  const { mutateAsync: deleteAccountAdmins } = api.accountAdmin.deleteAllForAccount.useMutation();
  const { mutateAsync: deleteAccountViewer } = api.accountViewer.delete.useMutation();
  const { mutateAsync: deleteAccountViewers } = api.accountViewer.deleteAllForAccount.useMutation();
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation();
  const { data: admins, refetch: getAdmins } = api.accountAdmin.getAdminsForAccount.useQuery({ accountId: id });
  const { data: viewers, refetch: getViewers } = api.accountViewer.getViewersForAccount.useQuery({ accountId: id });
  const router = useRouter();
  const { user } = useUser();
  const { data: self } = api.user.getByClerkId.useQuery({ clerkId: user?.id })

  function renderAdmins() {
    if (!admins) {
      return (
        <li>
          <Skeleton />
        </li>
      )
    }

    if (admins.length === 0) {
      return <li>No admins</li>
    }

    return (
      <>
        {
          admins.map((admin) => (
            <li key={admin.id} className="flex items-center">
              <div>{`${admin.name} (${admin.email})`}</div>
              <button
                className="text-xl"
                onClick={async () => {
                  if (!account) {
                    return;
                  }

                  if (admins.length === 1) {
                    toast.error('There always should be at least 1 admin for each account');
                    return;
                  }

                  if (confirm(`Are you sure you want to delete ${admin.name} (${admin.email}) as admin of account ${account.name}?`)) {
                    try {
                      await deleteAccountAdmin({
                        userId: admin.id,
                        accountId: account.id
                      })
                      toast.success('Admin deleted');
                      getAdmins();
                    } catch (e) { }
                  }

                  if (self && self.id === admin.id) {
                    router.push("/dashboard/accounts");
                  }
                }}
              >
                <TiDelete />
              </button>
            </li>
          ))
        }
      </>
    )
  }

  function renderViewers() {
    if (!viewers) {
      return (
        <li>
          <Skeleton />
        </li>
      )
    }

    if (viewers.length === 0) {
      return <li>No viewers</li>
    }

    return (
      <>
        {
          viewers.map((viewer) => (
            <li key={viewer.id} className="flex items-center">
              <div>{`${viewer.name} (${viewer.email})`}</div>
              <button
                className="text-xl"
                onClick={async () => {
                  if (!account) {
                    return;
                  }

                  if (confirm(`Are you sure you want to delete ${viewer.name} (${viewer.email}) as admin of account ${account.name}?`)) {
                    try {
                      await deleteAccountViewer({
                        userId: viewer.id,
                        accountId: account.id
                      })
                      toast.success('Viewer deleted');
                      getViewers();
                    } catch (e) { }
                  }
                }}
              >
                <TiDelete />
              </button>
            </li>
          ))
        }
      </>
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Account {id}</h1>
      <DashBoardNav />
      <div className="pt-6 italic">Admins of this account:</div>
      <ul>
        {renderAdmins()}
      </ul>
      <Link
        className="underline"
        href={`/dashboard/accounts/${id}/admins/new`}
      >
        Add new admin
      </Link>

      <div className="pt-6 italic">Viewers of this account:</div>
      <ul>
        {renderViewers()}
      </ul>
      <Link
        className="underline"
        href={`/dashboard/accounts/${id}/viewers/new`}
      >
        Add new viewer
      </Link>

      <div className="pt-6 italic">Account details:</div>
      <ul>
        <li>
          {!account ? (
            <Skeleton />
          ) :
            `Name: ${account.name}`
          }
        </li>
        <li>
          {!account ? (
            <Skeleton />
          ) :
            `Description: ${account.description}`
          }
        </li>
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
                  await deleteAccountViewers({
                    accountId: id,
                  })
                } catch (e) { }

                try {
                  await deleteAccountAdmins({
                    accountId: id,
                  })
                } catch (e) {
                  return;
                }

                try {
                  await deleteAccount({ id })
                  toast.success("Account deleted");
                  router.push("/dashboard/accounts");
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

interface ViewerAccountContentProps {
  id: number
}
function ViewerAccountContent({ id }: ViewerAccountContentProps) {
  const { data: admins, } = api.accountAdmin.getAdminsForAccount.useQuery({ accountId: id });
  const { data: viewers } = api.accountViewer.getViewersForAccount.useQuery({ accountId: id });

  function renderAdmins() {
    if (!admins) {
      return (
        <li>
          <Skeleton />
        </li>
      )
    }

    if (admins.length === 0) {
      return <li>No admins</li>
    }

    return (
      <>
        {
          admins.map((admin) => (
            <li key={admin.id} className="flex items-center">
              {`${admin.name} (${admin.email})`}
            </li>
          ))
        }
      </>
    )
  }

  function renderViewers() {
    if (!viewers) {
      return (
        <li>
          <Skeleton />
        </li>
      )
    }

    if (viewers.length === 0) {
      return <li>No viewers</li>
    }

    return (
      <>
        {
          viewers.map((viewer) => (
            <li key={viewer.id} className="flex items-center">
              {`${viewer.name} (${viewer.email})`}
            </li>
          ))
        }
      </>
    )
  }


  return (
    <>
      <h1 className='text-3xl'>You are viewer of Account {id}</h1>
      <DashBoardNav />
      <div className="pt-6 italic">Admins of this account:</div>
      <ul>
        {renderAdmins()}
      </ul>
      <div className="pt-6 italic">Viewers of this account:</div>
      <ul>
        {renderViewers()}
      </ul>
    </>
  )
}

export default AccountPage;
