import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Nav from "~/components/Nav";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { api } from "~/utils/api";

const NewEventPage: NextPage = () => {
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

export default NewEventPage;

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

type NewEvent = {
  name: string,
  description: string | null,
  income: string,
  saving: string,
}
function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });
  const router = useRouter();
  const { register, handleSubmit } = useForm<NewEvent>();
  const { mutateAsync: addEvent } = api.event.new.useMutation();

  const onSubmit: SubmitHandler<NewEvent> = async (data: NewEvent) => {
    const { name, description, income, saving } = data;
    
    const parsedIncome = parseInt(income);
    if (isNaN(parsedIncome)) {
      return;
    }

    const parsedSaving = parseInt(saving);
    if (isNaN(parsedSaving)) {
      return;
    }

    if (parsedSaving > parsedIncome) {
      toast.error("Saving can't be greater than income");
      return;
    }

    try {
      await addEvent({
        accountId,
        name,
        description,
        income: parsedIncome,
        saving: parsedSaving,
      })

      router.push(`/accounts/${accountId}`);
    } catch (e) {
      toast.error("Failed to add event");
    }
  }

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <h1 className='text-3xl'>Add event for account {accountId}</h1>
      <Nav />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4">
        <label htmlFor='name'>Event name</label>
        <input
          type='text'
          id='name'
          className='border-black border-2'
          {...register('name', { required: true })}
          required
        />

        <label htmlFor='description'>Description</label>
        <input
          type='text'
          id='description'
          className='border-black border-2'
          {...register('description')}
        />

        <label htmlFor='income'>{`Income amount (${account.currency})`}</label>
        <input
          type='number'
          id='income'
          min={0}
          max={9007199254740991}
          step={1}
          className='border-black border-2'
          {...register('income', { required: true })}
          required
        />

        <label htmlFor='Saving'>{`Saving amount (${account.currency})`}</label>
        <input
          type='number'
          id='saving'
          min={0}
          max={9007199254740991}
          step={1}
          className='border-black border-2'
          {...register('saving', { required: true })}
          required
        />

        <button
          type='submit'
          className='underline text-left'
        >
          Add
        </button>
      </form>
    </>
  )
}

