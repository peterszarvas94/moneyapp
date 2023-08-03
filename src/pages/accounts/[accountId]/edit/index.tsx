import type { NextPage } from "next";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import { api } from "~/utils/api";
import Spinner from "~/components/Spinner";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { useContext } from "react";
import NoAccess from "~/components/NoAccess";
import { AccountContext } from "~/context/account";

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
  name?: string;
  description?: string;
  currency?: string;
}

function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });
  const { register, handleSubmit } = useForm<Form>();
  const { mutateAsync: editAccount } = api.account.update.useMutation();
  const router = useRouter();
  const onSubmit: SubmitHandler<Form> = async (data: Form) => {
    const { name, description, currency } = data;
    if (!name || !currency || !description) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      await editAccount({
        accountId,
        name,
        currency,
        description
      });
      toast.success('Account updated');
    } catch (e) {
      toast.error('Error updating account');
      return;
    }

    router.push(`/accounts/${accountId}`);
  }

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>Edit Account {accountId}</h1>
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
