import { useAuth } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

const Home: NextPage = () => {

  const { signOut, isSignedIn } = useAuth();
  const { mutateAsync: mutatePublic } = api.test.publicTest.useMutation();
  const { mutateAsync: mutatePrivate } = api.test.privateTest.useMutation();

  return (
    <>
      <Head>
        <title>LLAA</title>
        <meta name="description" content="Language Learning AI app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

        <div className="flex flex-col items-start">

          {isSignedIn ? (
            <button
              onClick={() => {
                signOut()
                  .catch(() => {
                    toast.error("Failed to sign out");
                  });
              }}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/sign-in"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => {
              mutatePublic()
                .then(() => {
                  toast.success("Success");
                })
                .catch(() => {
                  toast.error("Failed");
                });
            }}
          >
            Test Public
          </button>


          <button
            onClick={() => {
              mutatePrivate()
                .then(() => {
                  toast.success("Success");
                })
                .catch(() => {
                  toast.error("Failed");
                });
            }}
          >
            Test Private
          </button>

        </div>
      </main>
    </>
  );
};

export default Home;
