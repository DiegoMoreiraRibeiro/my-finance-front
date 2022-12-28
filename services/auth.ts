import { v4 as uuid } from "uuid";
import { api, Post } from "./api";

type SignInRequestData = {
  email: string;
  senha: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestData) {
  await delay();
  let objRet = null;

  const response = await Post("login/auth", data);
  if (response.status == 201) {
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

  // await axios
  //   .post("http://localhost:3300/api/login/auth", data)
  //   .then((response) => {
  //     if (response.status == 201) {
  //       objRet = {
  //         token: response.data.access_token,
  //         user: {
  //           name: response.data.nome,
  //           email: response.data.email,
  //           avatar_url: "",
  //         },
  //       };
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("There was an error!", error);
  //   });

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
  await delay();

  return {
    user: {
      id: 0,
      name: "Diego Fernandes",
      email: "diego@rocketseat.com.br",
      avatar_url: "https://github.com/diego3g.png",
    },
  };
}
