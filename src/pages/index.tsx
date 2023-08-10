import type { NextPage } from "next";
import PageTitle from "~/components/PageTitle";
import HeadElement from "~/components/nav/HeadElement";
import Header from "~/components/nav/Header";

const Home: NextPage = () => {
  return (
    <>
      <HeadElement title="Moneyapp" description="Split the money" />
      <main>
        <Header page={"home"} />
        <PageTitle title='Moneyapp' />
        <p className='text-center'>Split the money</p>
      </main>
    </>
  );
};


export default Home;
