import type { NextPage } from "next";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import DashBoardNav from "~/components/DashBoardNav";
import { api } from "~/utils/api";
import { Account, UpdateAccount } from "~/server/db/schema";
import Spinner from "~/components/Spinner";
import usePageLoader from "~/hooks/usePageLoader";
import { AccountContext } from "~/context/account";
import { useContext } from "react";
import useCheckAccess from "~/hooks/useCheckAccess";
import NoAccess from "~/components/NoAccess";

const EditAccountPage: NextPage = () => {
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
  const { adminAccess } = useCheckAccess();
  if (adminAccess) {
    return (
      <AdminContent />
    )
  }

  return (
    <NoAccess />
  )
}

function AdminContent() {
  const { account, id } = useContext(AccountContext);
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
  const onSubmit: SubmitHandler<UpdateAccount> = async (data: UpdateAccount) => {
    try {
      await editAccount({ id: account.id, ...data });
      toast.success('Account updated');
    } catch (e) {
      toast.error('Error updating account');
      return;
    }

    router.push(`/dashboard/accounts/${account.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4">
      <label htmlFor='name'>Name</label>
      <input
        type='text'
        id='name'
        className='border-black border-2'
        {...register('name', { required: true })}
        required
        defaultValue={account.name}
      />

      <label htmlFor='description'>Description</label>
      <input
        type='text'
        id='description'
        className='border-black border-2'
        {...register('description')}
        defaultValue={account.description ?? undefined}
      />

      <label htmlFor='currency'>Currency</label>
      <input
        type='text'
        id='currency'
        className='border-black border-2'
        {...register('currency', { required: true })}
        required
        defaultValue={account.currency}
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
