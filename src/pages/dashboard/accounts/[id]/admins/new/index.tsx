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

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-6'>
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
        <Skeleton />
      ) : (
        <UserIsLoaded user={user} />
      )}
    </>
  )
}

interface UserIsLoadedProps {
  user: User | null | undefined
}
function UserIsLoaded({ user }: UserIsLoadedProps) {
  if (user === undefined) {
    return <div />
  }

  if (user === null) {
    return (
      <div>
        User not found
      </div>
    )
  }

  return (
    <UserFound user={user} />
  )
}

interface UserFoundProps {
  user: User
}
function UserFound({ user }: UserFoundProps) {
  // todo : add admin
  return (
    <>
      {`User found: ${user.email}`}
    </>
  )
}

export default AddAdmin;
