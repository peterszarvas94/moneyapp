import { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";

const PayeePage: NextPage = () => {
  return (
    <AccessedPage title="Account - Moneyapp" accessible="viewer">
      <Content />
    </AccessedPage>
  )
}

export default PayeePage;

function Content() {
  return (
    <PageTitle title="Payee" /> 
  )
}
