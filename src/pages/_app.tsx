import type { AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
