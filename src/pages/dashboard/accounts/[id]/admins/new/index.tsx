import type { NextPage } from "next";
import Head from "next/head";
import Redirect from "~/components/Redirect";
import Spinner from "~/components/Spinner";
import useAccountAccessCheck, { Access } from "~/hooks/useCheckAccess";
import useParseId from "~/hooks/useParseId";
import { useRouter } from "next/router";
import DashBoardNav from "~/components/DashBoardNav";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { User, User as UserFound } from "~/server/db/schema";

const AddAdmin: NextPage = () => {
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
    <Redirect url={`/dashboard/accounts/`} />
  )
}


interface AdminAccountContentProps {
  id: number;
}
type Form = {
  email: string
}
function AdminAccountContent({ id }: AdminAccountContentProps) {
  const [ user, setUser ] = useState<UserFound | undefined>(undefined);
  const { register, handleSubmit } = useForm<Form>();
  const { mutateAsync: searchUser } = api.user.getByEmail.useMutation();
  // const router = useRouter();
  const onSubmit: SubmitHandler<Form> = async ({ email }) => {
    try {
      const found = await searchUser({ email });
      setUser(found);
      return;
    } catch (e) {
      return;
    }

    setUser(undefined);
    // toast.success('Account updated');
    // router.push(`/dashboard/accounts/${id}`);
  }

  return (
    <>
      <h1 className='text-3xl'>Add admin for account {id}</h1>
      <DashBoardNav />

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-6'>
        <label htmlFor='description'>Email</label>
        <input
          type='text'
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
      
      {user ? (
        <UserFound user={user}/> 
      ) : (
        <div>
          User not found
        </div>
      )}
    </>
  )
}

interface UserFoundProps {
  user: User
}
function UserFound({ user }: UserFoundProps) {
  // todo : add admin
  return (
    <>
      {user.email}
    </>
  )
}

export default AddAdmin;
