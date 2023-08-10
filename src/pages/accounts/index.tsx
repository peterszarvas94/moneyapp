import type { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import AddButton from "~/components/AddButton";
import AccountList from "~/components/accounts/AccountList";
import HeadElement from "~/components/nav/HeadElement";
import Header from "~/components/nav/Header";

const AccountsPage: NextPage = () => {
  return (
    <>
      <HeadElement title="Accounts - Moneyapp" description="Split the money" />
      <Header page={"accounts"}/>
      <PageTitle title="Accounts" />
      <main>
        <div className="flex justify-center py-2">
          <AddButton url="/accounts/new" text="Create account" /> 
        </div>
        <AccountList/>
      </main>
    </>
  )
}

export default AccountsPage;
