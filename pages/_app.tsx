import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";

import "../public/styles/globals.css";
import "../public/styles/main.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps: { ...pageProps } }: any) {
  const [showChild, setShowChild] = useState(false);

  const getLayout = Component.getLayout ?? ((page: any) => page);

  if (Component.name == "Index") {
    return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  } else {
    return getLayout(
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  }
}
