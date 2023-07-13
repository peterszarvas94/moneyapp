import type { NextPage } from "next";
import type { Access } from "~/hooks/useCheckAccess";
import useAccountAccessCheck from "~/hooks/useCheckAccess";
import useParseId from "~/hooks/useParseId";
import Head from "next/head";
import Redirect from "~/components/Redirect";
import DashBoardNav from "~/components/DashBoardNav";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Account, UpdateAccount } from "~/server/db/schema";
import Spinner from "~/components/Spinner";
import { toast } from "react-hot-toast";

const EditAccountPage: NextPage = () => {
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
          <div>
            <Spinner /> 
          </div>
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
    <Redirect url={`/dashboard/accounts/${id}`} />
  )
}

interface AdminAccountContentProps {
  id: number;
}
function AdminAccountContent({ id }: AdminAccountContentProps) {
  const { data: account } = api.account.get.useQuery({ id });
  return (
    <>
      <h1 className='text-3xl'>Edit Account {id}</h1>
      <DashBoardNav />
      {!account ? (
        <Spinner />
      ) : (
        <AccountIsLoaded account={account} />
      )}
    </>
  )
}

interface AccountIsLoadedProps {
  account: Account;
}
function AccountIsLoaded({ account }: AccountIsLoadedProps) {
  const { register, handleSubmit } = useForm<UpdateAccount>();
  const { mutateAsync: editAccount } = api.account.edit.useMutation();
  const router = useRouter();
  const onSubmit: SubmitHandler<UpdateAccount> = async (data) => {
    try {
      await editAccount({ id: account.id, ...data });
    } catch (e) {}

    toast.success('Account updated');
    router.push(`/dashboard/accounts/${account.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-6'>
      <label htmlFor='name'>Name</label>
      <input
        type='text'
        id='name'
        className='border-black border-2'
        {...register('name', { required: true })}
        required
        defaultValue={account?.name}
      />

      <label htmlFor='description'>Description</label>
      <input
        type='text'
        id='description'
        className='border-black border-2'
        {...register('description')}
        defaultValue={account?.description ?? undefined}
      />

      <button
        type='submit'
        className='underline text-left'
      >
        Submit
      </button>
    </form>
  )
}

export default EditAccountPage;
