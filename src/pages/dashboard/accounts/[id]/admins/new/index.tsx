import type { NextPage } from "next";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";

import Redirect from "~/components/Redirect";
import Spinner from "~/components/Spinner";
import DashBoardNav from "~/components/DashBoardNav";
import { Access } from "~/hooks/useCheckAccess";
import useSearchUser from "~/hooks/useSearchUser";
import { User } from "~/server/db/schema";
import usePageLoader from "~/hooks/usePageLoader";
import Skeleton from "~/components/Skeleton";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const AddAdmin: NextPage = () => {
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
      <AdminContent id={id} />
    )
  }

  return (
    <Redirect url={`/dashboard/accounts/`} />
  )
}

interface AdminContentProps {
  id: number;
}
type Form = {
  email: string
}
function AdminContent({ id }: AdminContentProps) {
  const { register, handleSubmit } = useForm<Form>();
  const { search, user, loading } = useSearchUser();
  const onSubmit: SubmitHandler<Form> = async ({ email }) => search(email);

  return (
    <>
      <h1 className='text-3xl'>Add admin for account {id}</h1>
      <DashBoardNav />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4">
        <label htmlFor='description'>Email</label>
        <input
          type='email'
          id='description'
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
        <UserIsLoaded user={user} account={id} />
      )}
    </>
  )
}

interface UserIsLoadedProps {
  user: User | null | undefined;
  account: number;
}
function UserIsLoaded({ user, account }: UserIsLoadedProps) {
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
    <UserFound user={user} account={account} />
  )
}

interface UserFoundProps {
  user: User;
  account: number;
}
function UserFound({ user, account }: UserFoundProps) {
  const { mutateAsync: addAdmin } = api.accountAdmin.new.useMutation();
  const router = useRouter();
  const { data } = api.user.getByClerkId.useQuery({ clerkId: user.clerkId });

  return (
    <>
      <div className="pt-4">
        {`User found: ${user.name} (${user.email})`}
      </div>
      <button
        className="underline"
        onClick={async () => {
          if (!data) {
            return;
          }

          try {
            await addAdmin({
              accountId: account,
              userId: data.id,
            });

            toast.success("Admin added");
            router.push(`/dashboard/accounts/${account}`);
          } catch (e) {}
        }}
      >
        Add as admin
      </button>
    </>
  )
}

export default AddAdmin;