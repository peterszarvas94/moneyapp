import { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import HeadElement from "~/components/nav/HeadElement";
import Header from "~/components/nav/Header";
import { PageContext } from "~/context/page";

const DashboardPage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "dashboard" }}>
      <HeadElement title="Dashboard - Moneyapp" description="Split the money" />
      <Header />
      <main>
        <PageTitle title="Dashboard" />
      </main>
    </PageContext.Provider>
  )
}

export default DashboardPage;
