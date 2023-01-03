import { v4 as uuid } from "uuid";
import { api, Post, PostAuth } from "./api";

type SignInRequestData = {
  email: string;
  senha: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestData) {
  await delay();
  let objRet = null;

  const response = await PostAuth("login/auth", data);

  if (response == null) {
    objRet = {
      token: null,
      user: null,
    };
  } else if (response?.status == 201) {
    objRet = {
      token: response.data.access_token,
      user: {
        id: response.data.id,
        name: response.data.nome,
        email: response.data.email,
        avatar_url: "",
      },
    };
  }

  if (objRet != null) {
    return objRet;
  } else {
    return {
      token: "",
      user: {
        id: 0,
        name: "",
        email: "",
        avatar_url: "",
      },
    };
  }
}

export async function recoverUserInformation() {
  return {
    user: {
      id: 0,
      name: "",
      email: "",
      avatar_url: "",
    },
  };
}
