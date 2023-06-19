import { useAuth } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";

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
        <h1>
          this is the homepage of LLAA
        </h1>
        {!isSignedIn ? (
          <Link
            href="/sign-in"
          >
            Sign In
          </Link>
        ) : (
          <div
            className="flex flex-col items-start"
          >
            <button
              onClick={async () => {
                try {
                  await signOut();
                } catch {
                  toast.error("Failed to sign out");
                }
              }}
            >
              Sign Out
            </button>

            <Link
              href="/dashboard"
            >
              Dashboard
            </Link>
          </div>

        )}
      </main>
    </>
  );
};

export default Home;
