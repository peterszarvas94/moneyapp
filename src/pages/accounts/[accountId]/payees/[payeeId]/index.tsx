import { NextPage } from "next";
import BackButton from "~/components/BackButton";
import PageTitle from "~/components/PageTitle";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useAccountContext } from "~/context/account";

const PayeePage: NextPage = () => {
  return (
    <AccessedPage title="Account - Moneyapp" accessible="viewer">
      <Content />
    </AccessedPage>
  )
}

export default PayeePage;

function Content() {
  const { accountId } = useAccountContext();
  return (
    <>
      <PageTitle title="Payee" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>
    </>
  )
}
