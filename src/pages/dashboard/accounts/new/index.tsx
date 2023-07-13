import type { Account, NewAccount as NewAccountType } from "~/server/db/schema";
import type { NextPage } from "next";
import Head from "next/head";
import DashBoardNav from "~/components/DashBoardNav";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import useCheckUserLoaded from "~/hooks/useCheckUserLoaded";
import Redirect from "~/components/Redirect";

const NewAccount: NextPage = () => {
  const { user, checked } = useCheckUserLoaded();
  if (!checked) {
    return (
      <div>
        Loading...
      </div>
    );
  }
  if (!user) {
    return (
      <Redirect url='/,' />
    );
  }
  return (
    <UserIsLoaded clerkId={user.id}/>
  )
}

interface UserIsLoadedProps {
  clerkId: string;
}
function UserIsLoaded({ clerkId }: UserIsLoadedProps) {
  const { mutateAsync: createAccount } = api.account.new.useMutation();
  const { mutateAsync: addAdmin } = api.accountAdmin.new.useMutation();
  const router = useRouter();
  const { register, handleSubmit } = useForm<NewAccountType>();

  const onSubmit: SubmitHandler<NewAccountType> = async (data: NewAccountType) => {
    let created: Account;
    try {
      created = await createAccount(data);
    } catch (e) {
      return;
    }

    try {
      await addAdmin({
        accountId: created.id,
        clerkId
      });
    } catch (e) {
      return;
    }

    toast.success("Account created");
    router.push("/dashboard/accounts");
  }

  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1 className='text-3xl'>This is New Account</h1>
          <DashBoardNav />

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-6'>
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

            <button
              type='submit'
              className='underline text-left'
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default NewAccount;
