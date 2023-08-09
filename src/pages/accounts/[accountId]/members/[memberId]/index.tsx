import type { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";

const MemberPage: NextPage = () => {
  return (
    <AccessedPage title="Member - Moneyapp" accessible="viewer" >
      <Content />
    </AccessedPage>
  )
}

export default MemberPage;

function Content() {
  return (
    <PageTitle title="Member" />
  )
}
