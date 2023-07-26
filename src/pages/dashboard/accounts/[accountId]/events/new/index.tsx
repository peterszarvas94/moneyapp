import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Nav from "~/components/Nav";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AppContext } from "~/context/app";
import useAccountCheckAccess from "~/hooks/useAccountCheckAccess";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { api } from "~/utils/api";

const NewEventPage: NextPage = () => {
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

export default NewEventPage;

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

type NewEvent = {
  name: string,
  description: string,
  income: string,
}
function AdminContent() {
  const router = useRouter();
  const { account } = useContext(AppContext);
  const { register, handleSubmit } = useForm<NewEvent>();
  const { mutateAsync: addEvent } = api.event.new.useMutation();
    
  const onSubmit: SubmitHandler<NewEvent> = async ({ name, description, income }) => {
    if (!account) {
      return;
    }

    const parsedIncome = parseInt(income);
    if (isNaN(parsedIncome)) {
      return;
    }

    try {
      await addEvent({
        accountId: account.id,
        name,
        description,
        income: parsedIncome,
      })

      router.push(`/dashboard/accounts/${account.id}`);
    } catch (e) {
      toast.error("Failed to add event");
    }
  }

  if (!account) {
    return (
      <Spinner/>
    )
  }

  return (
    <>
      <h1 className='text-3xl'>Add event for account {account.id}</h1>
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
          {...register('description', { required: true })}
          required
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

