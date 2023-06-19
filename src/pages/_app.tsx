import type { AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from 'react-hot-toast';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import "~/styles/globals.css";
import { useRouter } from "next/router";

const publicPages = [
  "/",
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]"
];

const MyApp: AppType = ({ Component, pageProps }) => {

  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Toaster />
            <Component {...pageProps} />
          </SignedIn>

          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
