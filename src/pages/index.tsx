import { useAuth } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

const Home: NextPage = () => {

  const { signOut, isSignedIn } = useAuth();
  const { mutateAsync: newUser } = api.user.new.useMutation();
  const { mutateAsync: getUser } = api.user.getFromId.useMutation();

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
                onClick={() => {
                  signOut()
                    .catch(() => {
                      toast.error("Failed to sign out");
                    });
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
          <button
            className='underline'
            onClick={async () => {
              try {
                const res = await newUser({
                  name: "Test User",
                  email: "test@email.com",
                  clerkId: "ck_test",
                })
                toast.success(`User is created: ${res.name}`);
              } catch {
                toast.error(`Can not create user`);
              }
            }}
          >
            New User
          </button>
          <button
            className='underline'
            onClick={async () => {
              try {
                const res = await getUser({
                  id: 14
                })
                toast.success(`User name is: ${res.name}`);
              } catch {
                toast.error("User 14 is not found");
              }
            }}
          >
            Get User 14
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
