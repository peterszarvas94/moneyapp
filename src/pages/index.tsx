import { useAuth } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

const Home: NextPage = () => {

  const { signOut, isSignedIn } = useAuth();
  const { mutateAsync: newUser } = api.user.new.useMutation();

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
              newUser({
                name: "Test User",
                email: "test@email.com",
                clerkId: "ck_test",
              })
                .then(() => {
                  toast.success("New user created");
                })
                .catch(() => {
                  toast.error("Failed to create new user");
                });
            }}
          >
            New User
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
