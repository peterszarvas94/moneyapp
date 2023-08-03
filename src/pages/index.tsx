import type { NextPage } from "next";
import HeadElement from "~/components/Head";
import PageTitle from "~/components/PageTitle";
import Header from "~/components/Header";

const Home: NextPage = () => {
  return (
    <>
      <HeadElement title="Moneyapp" description="Split the money" />
      <main>
        <Header home={true} />
        <PageTitle title='Moneyapp' />
        <p className='text-center'>Split the money</p>
      </main>
    </>
  );
};


export default Home;
