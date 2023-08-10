import { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import HeadElement from "~/components/nav/HeadElement";
import Header from "~/components/nav/Header";

const DashboardPage: NextPage = () => {
  return (
    <>
      <HeadElement title="Dashboard - Moneyapp" description="Split the money" />
      <main>
        <Header page={"dashboard"} />
        <PageTitle title="Dashboard" />
      </main>
    </>
  )
}

export default DashboardPage;
