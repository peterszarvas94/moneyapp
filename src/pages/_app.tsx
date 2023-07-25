import type { AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from "@clerk/nextjs";
import UserProvider from "~/context/user";
import "~/styles/globals.css";
import AccountProvider from "~/context/account";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <UserProvider>
        <AccountProvider>
        <Toaster />
        <Component {...pageProps} />
        </AccountProvider>
      </UserProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
