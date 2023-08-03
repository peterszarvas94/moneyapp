import type { NextPage } from "next";
import HeadElement from "~/components/Head";
import PageTitle from "~/components/PageTitle";
import AdminAccountList from "~/components/accounts/Admin";
import ViewerAccountList from "~/components/accounts/Viewer";
import Header from "~/components/Header";
import AddButton from "~/components/AddButton";

const AccountsPage: NextPage = () => {
  return (
    <>
      <HeadElement title="Accounts - Moneyapp" description="Split the money" />
      <Header />
      <PageTitle title="Accounts" />
      <main>
        <div className="flex justify-center py-2">
          <AddButton url="/accounts/new" text="Create account" /> 
        </div>
        <AdminAccountList />
        <ViewerAccountList />
      </main>
    </>
  )
}

export default AccountsPage;
