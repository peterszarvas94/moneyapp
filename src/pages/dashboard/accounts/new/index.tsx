import type { Account, NewAccount as NewAccountType } from "~/server/db/schema";
import type { NextPage } from "next";
import Head from "next/head";
import DashBoardNav from "~/components/DashBoardNav";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "~/context/user";

const NewAccountPage: NextPage = () => {
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
  )
}

function Page() {
  const { mutateAsync: createAccount } = api.account.new.useMutation();
  const { mutateAsync: addAdmin } = api.admin.new.useMutation();
  const router = useRouter();
  const { register, handleSubmit } = useForm<NewAccountType>();
  const { user } = useContext(UserContext);

  const onSubmit: SubmitHandler<NewAccountType> = async (data: NewAccountType) => {
    if (!user) {
      return;
    }

    let created: Account;
    try {
      created = await createAccount(data);
    } catch (e) {
      toast.error("Account creation failed");
      return;
    }

    try {
      await addAdmin({
        accountId: created.id,
        userId: user.id
      });
    } catch (e) {
      toast.error("Account creation failed");
      return;
    }

    toast.success("Account created");
    router.push("/dashboard/accounts");
  }

  return (
    <div>
      <h1 className='text-3xl'>This is New Account</h1>
      <DashBoardNav />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4">
        <label htmlFor='name'>Name</label>
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

        <label htmlFor='currency'>Currency</label>
        <input
          type='text'
          id='currency'
          className='border-black border-2'
          {...register('currency', { required: true })}
          required
        />

        <button
          type='submit'
          className='underline text-left'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewAccountPage;
