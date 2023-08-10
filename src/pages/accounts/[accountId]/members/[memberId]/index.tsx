import type { NextPage } from "next";
import BackButton from "~/components/BackButton";
import PageTitle from "~/components/PageTitle";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useAccountContext } from "~/context/account";

const MemberPage: NextPage = () => {
  return (
    <AccessedPage title="Member - Moneyapp" accessible="viewer" >
      <Content />
    </AccessedPage>
  )
}

export default MemberPage;

function Content() {
  const { accountId } = useAccountContext();
  return (
    <>
      <PageTitle title="Member" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>
    </>
  )
}
