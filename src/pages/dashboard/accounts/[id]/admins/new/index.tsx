import type { NextPage } from "next";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import DashBoardNav from "~/components/DashBoardNav";
import useCheckAccess  from "~/hooks/useCheckAccess";
import useSearchUser from "~/hooks/useSearchUser";
import { User } from "~/server/db/schema";
import usePageLoader from "~/hooks/usePageLoader";
import Skeleton from "~/components/Skeleton";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { AccountContext } from "~/context/account";
import { useContext } from "react";
import { UserContext } from "~/context/user";
import NoAccess from "~/components/NoAccess";

const AddAdminPage: NextPage = () => {
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

type Form = {
  email: string
}
function AdminContent() {
  const { user: self } = useContext(UserContext);
  const { id: accountId } = useContext(AccountContext);
  const { register, handleSubmit } = useForm<Form>();
  const { search, user, loading } = useSearchUser();

  const onSubmit: SubmitHandler<Form> = async ({ email }) => {
    if (self && self.email === email) {
      toast.error("You can't add yourself as an admin");
      return;
    }
    search(email);
  }

  return (
    <>
      <h1 className='text-3xl'>Add admin for account {accountId}</h1>
      <DashBoardNav />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4">
        <label htmlFor='description'>Email</label>
        <input
          type='email'
          id='description'
          className='border-black border-2'
          {...register('email', { required: true })}
          required
        />

        <button
          type='submit'
          className='underline text-left'
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="pt-4">
          <Skeleton />
        </div>
      ) : (
        <SearchDone user={user} />
      )}
    </>
  )
}

interface SearchDoneProps {
  user: User | null | undefined;
}
function SearchDone({ user }: SearchDoneProps) {
  if (user === undefined) {
    return <div />
  }

  if (user === null) {
    return (
      <div className="pt-4">
        User not found
      </div>
    )
  }

  return (
    <UserFound user={user} />
  )
}

interface UserFoundProps {
  user: User;
}
function UserFound({ user }: UserFoundProps) {
  const router = useRouter();
  const { user: self } = useContext(UserContext);
  const { account } = useContext(AccountContext);
  const { data: checkAdmin } = api.admin.checkAccess.useQuery({
    userId: user.id,
    accountId: account?.id
  });
  const { data: checkViewer } = api.viewer.checkAccess.useQuery({
    userId: user.id,
    accountId: account?.id
  });
  const { mutateAsync: addAdmin } = api.admin.new.useMutation();

  return (
    <>
      <div className="pt-4">
        {`User found: ${user.name} (${user.email})`}
      </div>
      <button
        className="underline"
        onClick={async () => {
          if (!self || checkAdmin === undefined || checkViewer === undefined || !account) {
            return;
          }

          if (checkAdmin) {
            toast.error("User is already admin");
            return;
          }

          if (checkViewer) {
            toast.error("User is already viewer");
            return;
          }

          try {
            await addAdmin({
              accountId: account.id,
              userId: user.id
            });

            toast.success("Viewer added");
            router.push(`/dashboard/accounts/${account}`);
          } catch (e) {
            toast.error("Failed to add admin");
          }
        }}
      >
        Add as admin
      </button>
    </>
  )
}

export default AddAdminPage;
