import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import Router from "next/router";
import "./../styles/globals.css";
import "./../styles/main.css";
import { parseCookies } from "nookies";
import Index from ".";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps: { ...pageProps } }: any) {
  const { "nextauth.token": token } = parseCookies();
  const [showChild, setShowChild] = useState(false);

  const getLayout = Component.getLayout ?? ((page: any) => page);

  if (Component.name == "Index") {
    return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  } else {
    if (token == "" || token == undefined) {
      return (
        <AuthProvider>
          <Index />
        </AuthProvider>
      );
    }
    return getLayout(
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  }
}
