import type { NextPage } from "next";
import type { User } from "~/server/db/schema";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import Nav from "~/components/Nav";
import useSearchUser from "~/hooks/useSearchUser";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import Skeleton from "~/components/Skeleton";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useContext } from "react";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";

const NewAdminPage: NextPage = () => {
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
  const { accountId } = useAccountIdParser();

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId }}>
      <IdParsed />
    </AccountContext.Provider>
  )

}

function IdParsed() {
  const { accountId } = useContext(AccountContext);
  const { data: access, error } = api.account.getAccess.useQuery({ accountId });

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <NoAccess />
    )
  }

  if (access === "admin") {
    return (
      <AdminContent />
    )
  }

  return (
    <Spinner />
  )
}

type Form = {
  email: string
}
function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { data: self } = api.user.getSelf.useQuery();
  const { register, handleSubmit } = useForm<Form>();
  const { search, user, loading } = useSearchUser();

  const onSubmit: SubmitHandler<Form> = async ({ email }) => {
    if (self && self.email === email) {
      toast.error("You can't add yourself as an admin");
      return;
    }
    search(email);
  }

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>Add admin for account {accountId}</h1>
      <Nav />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4">
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          className='border-black border-2'
          {...register('email', { required: true })}
          required
        />

        <button
          type='submit'
          className='underline text-left'
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="pt-4">
          <Skeleton />
        </div>
      ) : (
        <SearchDone user={user} />
      )}
    </>
  )
}

interface SearchDoneProps {
  user: User | null | undefined;
}
function SearchDone({ user }: SearchDoneProps) {
  if (user === undefined) {
    return <div />
  }

  if (user === null) {
    return (
      <div className="pt-4">
        User not found
      </div>
    )
  }

  return (
    <UserFound user={user} />
  )
}

interface UserFoundProps {
  user: User;
}
function UserFound({ user }: UserFoundProps) {
  const router = useRouter();
  const { accountId } = useContext(AccountContext);
  const { data: checkAdmin } = api.admin.checkAccess.useQuery({
    userId: user.id,
    accountId: accountId
  });
  const { data: checkViewer } = api.viewer.checkAccess.useQuery({
    userId: user.id,
    accountId: accountId
  });
  const { mutateAsync: addAdmin } = api.admin.new.useMutation();

  return (
    <>
      <div className="pt-4">
        {`User found: ${user.name} (${user.email})`}
      </div>
      <button
        className="underline"
        onClick={async () => {
          if (!self || checkAdmin === undefined || checkViewer === undefined) {
            return;
          }

          if (checkAdmin) {
            toast.error("User is already admin");
            return;
          }

          if (checkViewer) {
            toast.error("User is already viewer");
            return;
          }

          try {
            await addAdmin({
              accountId: accountId,
              userId: user.id
            });

            toast.success("Admin added");
            router.push(`/accounts/${accountId}`);
          } catch (e) {
            toast.error("Failed to add admin");
          }
        }}
      >
        Add as admin
      </button>
    </>
  )
}

export default NewAdminPage;
