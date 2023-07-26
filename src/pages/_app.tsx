import type { AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import ContextProvider from "~/context/app";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <ContextProvider>
        <Toaster />
        <Component {...pageProps} />
      </ContextProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
