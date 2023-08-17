import type { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import HeadElement from "~/components/nav/HeadElement";
import Header from "~/components/nav/Header";
import { PageContext } from "~/context/page";

const Home: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "home" }}>
      <HeadElement title="Moneyapp" description="Split the money" />
      <main>
        <Header page={"home"} />
        <PageTitle title='Moneyapp' />
        <p className='text-center'>Split the money</p>
      </main>
    </PageContext.Provider>
  );
};


export default Home;
