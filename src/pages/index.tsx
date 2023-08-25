import { useAuth } from "@clerk/nextjs";
import type { NextPage } from "next";
import ForwardButton from "~/components/ForwardButton";
import PageTitle from "~/components/PageTitle";
import HeadElement from "~/components/nav/HeadElement";
import Header from "~/components/nav/Header";
import { PageContext } from "~/context/page";

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();
  return (
    <PageContext.Provider value={{ page: "home" }}>
      <HeadElement title="Moneyapp" description="Split the money" />
      <Header />
      <main>
        <PageTitle title='Moneyapp' />
        <p className='text-center'>Split the money</p>
        <div className="flex justify-center py-6">
          <ForwardButton url='/dashboard' text={isSignedIn ? "Dashboard" : "Log in"} />
        </div>
      </main>
    </PageContext.Provider>
  );
};


export default Home;
