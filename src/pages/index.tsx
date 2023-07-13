import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const Home: NextPage = () => {

  const { signOut, isSignedIn } = useAuth();

  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col items-start">
          <h1 className='text-3xl'>This is Homepage</h1>
          {isSignedIn ? (
            <>
              <button
                className='underline'
                onClick={async () => {
                  try {
                    await signOut()
                  } catch (e) {}
                }}
              >
                Sign Out
              </button>
              <Link
                href="/dashboard"
                className='underline'
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/sign-in"
              className='underline'
            >
              Sign in
            </Link>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
