import type { NextPage } from "next";
import type { UpdateAccount } from "~/server/db/schema";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import { api } from "~/utils/api";
import Spinner from "~/components/Spinner";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { useContext } from "react";
import useAccountCheckAccess from "~/hooks/useAccountCheckAccess";
import NoAccess from "~/components/NoAccess";
import { AppContext } from "~/context/app";

const EditAccountPage: NextPage = () => {
  useAccountIdParser();

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
  const { adminAccess } = useAccountCheckAccess();
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
  const { account } = useContext(AppContext);
  const { register, handleSubmit } = useForm<UpdateAccount>();
  const { mutateAsync: editAccount } = api.account.edit.useMutation();
  const router = useRouter();
  const onSubmit: SubmitHandler<UpdateAccount> = async (data: UpdateAccount) => {
    if (!account) {
      return;
    }

    try {
      await editAccount({ id: account.id, ...data });
      toast.success('Account updated');
    } catch (e) {
      toast.error('Error updating account');
      return;
    }

    router.push(`/dashboard/accounts/${account.id}`);
  }

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>Edit Account {account.id}</h1>
      <Nav />
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
    </>
  )
}

export default EditAccountPage;
