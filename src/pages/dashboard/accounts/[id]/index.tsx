import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Head from "next/head";
import { TiDelete } from "react-icons/ti";
import DashBoardNav from "~/components/DashBoardNav";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Skeleton from "~/components/Skeleton";
import { useContext, useEffect } from "react";
import { AccountContext } from "~/context/account";
import { UserContext } from "~/context/user";
import NoAccess from "~/components/NoAccess";
import useCheckAccess from "~/hooks/useCheckAccess";
import usePageLoader from "~/hooks/usePageLoader";

const AccountPage: NextPage = () => {
  usePageLoader();
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Page />
      </main>
    </>
  );
}

function Page() {
  const { adminAccess, viewerAccess } = useCheckAccess();
  if (adminAccess) {
    return (
      <AdminContent />
    )
  }

  if (viewerAccess) {
    return (
      <ViewerContent />
    )
  }

  return (
    <NoAccess />
  )
}

function AdminContent() {
  const { account, id: accountId, refetch } = useContext(AccountContext);
  const { user: self } = useContext(UserContext);
  const { mutateAsync: deleteAdmin } = api.admin.delete.useMutation();
  const { mutateAsync: deleteViewer } = api.viewer.delete.useMutation();
  const { mutateAsync: deleteAdmins } = api.account.deleteAdmins.useMutation();
  const { mutateAsync: deleteEvents } = api.account.deleteEvents.useMutation();
  const { mutateAsync: deleteViewers } = api.account.deleteViewers.useMutation();
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation();
  const { data: admins, refetch: getAdmins } = api.account.getAdmins.useQuery({ accountId });
  const { data: viewers, refetch: getViewers } = api.account.getViewers.useQuery({ accountId });
  const { data: events } = api.account.getEvents.useQuery({ accountId });
  const router = useRouter();

  useEffect(() => {
    console.log('refetched');
    refetch()
  }, [accountId])

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
                      await deleteAdmin({
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

                  if (confirm(`Are you sure you want to delete ${viewer.name} (${viewer.email}) as viewer of account ${account.name}?`)) {
                    try {
                      await deleteViewer({
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

  function renderEvents() {
    if (!events) {
      return (
        <li>
          <Skeleton />
        </li>
      )
    }

    if (events.length === 0) {
      return (
        <li>
          No events
        </li>
      )
    }

    return (
      <>
        {
          events.map((event) => (
            <li key={event.id} className="flex items-center">
              <div>{event.name}</div>
            </li>
          ))
        }
      </>
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are admin of Account {accountId}</h1>
      <DashBoardNav />
      <div className="pt-6 italic">Admins of this account:</div>
      <ul>
        {renderAdmins()}
      </ul>
      <Link
        className="underline"
        href={`/dashboard/accounts/${accountId}/admins/new`}
      >
        Add new admin
      </Link>

      <div className="pt-6 italic">Viewers of this account:</div>
      <ul>
        {renderViewers()}
      </ul>
      <Link
        className="underline"
        href={`/dashboard/accounts/${accountId}/viewers/new`}
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
          {!account ? (
            <Skeleton />
          ) :
            `Currency: ${account.currency}`
          }
        </li>
        <li>
          <Link
            href={`/dashboard/accounts/${accountId}/edit`}
            className="underline"
          >
            Edit
          </Link>
        </li>
        <li>
          <button
            className="underline"
            onClick={async () => {
              if (!accountId) {
                return;
              }

              if (confirm("Are you sure?")) {
                try {
                  await deleteViewers({
                    accountId,
                  })
                } catch (e) { }

                try {
                  await deleteAdmins({
                    accountId,
                  })
                } catch (e) {
                  return;
                }

                try {
                  await deleteEvents({
                    accountId
                  })
                } catch (e) {
                  return;
                }

                try {
                  await deleteAccount({ id: accountId })
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

      <div className="pt-6 italic">Events of this account:</div>
      <ul>
        {renderEvents()}
      </ul>

    {/*
       todo... add event
        <Link
        className="underline"
    */}
    </>
  )
}

function ViewerContent() {
  const { id: accountId, account } = useContext(AccountContext);
  const { data: admins, } = api.account.getAdmins.useQuery({ accountId });
  const { data: viewers } = api.account.getViewers.useQuery({ accountId });
  const { data: events } = api.account.getEvents.useQuery({ accountId });

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

  function renderEvents() {
    if (!events) {
      return (
        <li>
          <Skeleton />
        </li>
      )
    }

    if (events.length === 0) {
      return (
        <li>
          No events
        </li>
      )
    }

    return (
      <>
        {
          events.map((event) => (
            <li key={event.id} className="flex items-center">
              <div>{event.name}</div>
            </li>
          ))
        }
      </>
    )
  }

  return (
    <>
      <h1 className='text-3xl'>You are viewer of Account {accountId}</h1>
      <DashBoardNav />
      <div className="pt-6 italic">Admins of this account:</div>
      <ul>
        {renderAdmins()}
      </ul>
      <div className="pt-6 italic">Viewers of this account:</div>
      <ul>
        {renderViewers()}
      </ul>
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
          {!account ? (
            <Skeleton />
          ) :
            `Currency: ${account.currency}`
          }
        </li>
      </ul>
      <div className="pt-6 italic">Events of this account:</div>
      <ul>
        {renderEvents()}
      </ul>
    </>
  )
}

export default AccountPage;
