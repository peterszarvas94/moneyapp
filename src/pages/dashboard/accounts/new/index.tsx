import type { NewAccount } from "~/server/db/schema";
import Head from "next/head";
import DashBoardNav from "~/components/DashBoardNav";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

function NewAccount() {
  const { register, handleSubmit, formState: {} } = useForm<NewAccount>();

  const { mutateAsync: newAccount } = api.account.new.useMutation();

  const onSubmit: SubmitHandler<NewAccount> = async (data: NewAccount) => {
    try {
      await newAccount(data);
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    }
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
