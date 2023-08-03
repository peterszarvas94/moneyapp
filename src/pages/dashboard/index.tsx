import { NextPage } from "next";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import PageTitle from "~/components/PageTitle";

const Dashboard: NextPage = () => {
  return (
    <>
      <HeadElement title="Dashboard - Moneyapp" description="Split the money" />
      <main>
        <div>
          <Header />
          <PageTitle title="Dashboard" />
        </div>
      </main>
    </>
  )
}

export default Dashboard;
