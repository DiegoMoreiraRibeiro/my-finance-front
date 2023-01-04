import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import Router from "next/router";
import "./../styles/globals.css";
import "./../styles/main.css";
import { parseCookies } from "nookies";
import Index from ".";
import Theme from "../components/views/theme";
import Head from "next/head";
import dynamic from "next/dynamic";

export type NextPageWithTheme<P = {}, IP = P> = NextPage<P, IP> & {
  getTheme?: (page: ReactElement) => ReactNode;
};

type AppPropsWithTheme = AppProps & {
  Component: NextPageWithTheme;
};

export default function MyApp({ Component, pageProps: { ...pageProps } }: any) {
  const { "nextauth.token": token } = parseCookies();

  function getHeader() {
    return (
      <div>
        <Head>
          <title>My page title</title>
          <meta property="og:title" content="My page title" key="title" />
        </Head>
        <Head>
          <meta property="og:title" content="My new title" key="title" />
        </Head>
      </div>
    );
  }

  const TH = dynamic(() => import("../components/views/theme"), {
    ssr: false,
  });

  function getPageAndAuth(Component) {
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
      return (
        <AuthProvider>
          <TH>
            <Component {...pageProps} />
          </TH>
        </AuthProvider>
      );
    }
  }

  return (
    <>
      {getHeader()}
      {getPageAndAuth(Component)}
    </>
  );
}
