import type { NextPage } from "next";
import type { Access } from "~/hooks/useCheckAccess";
import useAccountAccessCheck from "~/hooks/useCheckAccess";
import useParseId from "~/hooks/useParseId";
import Head from "next/head";
import Redirect from "~/components/Redirect";
import DashBoardNav from "~/components/DashBoardNav";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const EditAccountPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { parsedId } = useParseId({ id });
  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!parsedId ? (
          <div>
            Loading...
          </div>
        ) : (
          <IdIsParsed id={parsedId} />
        )}
      </main>
    </>
  );
}
export default EditAccountPage;

interface IdIsParsedProps {
  id: number;
}
function IdIsParsed({ id }: IdIsParsedProps) {
  const { access, checked } = useAccountAccessCheck({ accountId: id });
  return (
    <>
      {!checked ? (
        <div>
          Checking Access...
        </div>
      ) : (
        <AccessIsChecked access={access} id={id} />
      )}
    </>
  )
}

interface AccessIsChecked {
  access: Access;
  id: number;
}
function AccessIsChecked({ access, id }: AccessIsChecked) {
  if (access === "admin") {
    return (
      <AdminAccountContent id={id} />
    )
  }

  return (
    <Redirect url={`/dashboard/accounts/${id}`} />
  )
}

interface AdminAccountContentProps {
  id: number;
}
function AdminAccountContent({ id }: AdminAccountContentProps) {
  const { data: account } = api.account.get.useQuery({ id });
  return (
    <>
      <h1 className='text-3xl'>Edit Account {id}</h1>
      <DashBoardNav />
      <ul className="pt-6">
        <li>Name: {account?.name}</li>
        <li>Description: {account?.description}</li>
      </ul>
      <div>Form</div>
    </>
  )
}
