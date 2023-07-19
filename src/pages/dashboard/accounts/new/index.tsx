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
import Spinner from "~/components/Spinner";

const NewAccount: NextPage = () => {
  const { user, checked } = useCheckUserLoaded();
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!checked ? (
          <Spinner />
        ) : (
          <Page user={user ? user.id : undefined} />
        )}
      </main>
    </>
  )
}

interface PageProps {
  user?: string;
}
function Page({ user }: PageProps) {
  if (user) {
    return (
      <UserIsLoaded clerkId={user} />
    )
  }

  return (
    <Redirect url='/' />
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
  const { data } = api.user.getByClerkId.useQuery({ clerkId });

  const onSubmit: SubmitHandler<NewAccountType> = async (formData: NewAccountType) => {
    if (!data) {
      return;
    }

    let created: Account;
    try {
      created = await createAccount(formData);
    } catch (e) {
      return;
    }

    try {
      await addAdmin({
        accountId: created.id,
        userId: data.id
      });
    } catch (e) {
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

export default NewAccount;
