import React, { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { recoverUserInformation, signInRequest } from "../services/auth";
import { api } from "../services/api";

type User = {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
};

type SignInData = {
  email: string;
  senha: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | any;
  signIn: (data: SignInData) => Promise<Boolean>;
};

export const AuthContext = createContext({} as AuthContextType);

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

export function AuthProvider({ children, ...props }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token && token != "") {
      recoverUserInformation().then((response) => {
        setUser(user);
      });
    } else {
      Router.push("/");
    }
  }, [user]);

  async function signIn({ email, senha }: SignInData) {
    const { token, user } = await signInRequest({ email, senha });

    if (token != null && token != "") {
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      setCookie(undefined, "nextauth.id", user.id);
      setCookie(undefined, "nextauth.email", user.email);
      setCookie(undefined, "nextauth.email", user.email);

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      setUser(user);

      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
