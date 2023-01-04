import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Grid } from "@mui/material";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import Msg from "../components/utils/Msg";
import Loading from "../components/utils/Loading";
import Router from "next/router";
import { setCookie } from "nookies";
import TextInput from "../components/inputs/text-input";

export default function Index() {
  const { handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    clearCokies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignIn() {
    clearCokies();
    setLoading(true);
    let data = {
      email: email,
      senha: senha,
    };
    let ret = await signIn(data);

    if (!ret) {
      setActive(true);
    } else {
      Router.push("/admin/dashboard");
      setActive(false);
    }

    setLoading(false);
  }

  function clearCokies() {
    setCookie(undefined, "nextauth.token", "");
    setCookie(undefined, "nextauth.id", "");
    setCookie(undefined, "nextauth.email", "");
    setCookie(undefined, "nextauth.email", "");
    deleteAllCookies();
  }

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  function closeMsg() {
    setActive(false);
  }

  function showLoading() {
    if (loading) {
      return <Loading />;
    } else {
      return <></>;
    }
  }

  return (
    <Grid container spacing={3}>
      {showLoading()}
      <Msg
        desc={"Usuário e/ou senha invalidos"}
        active={active}
        handleClose={closeMsg}
        type="error"
      />

      <Grid item sm={12} className={"dividerBr"}></Grid>
      <Grid item xs={10} md={4} lg={4} sm={12} className="containerLogin">
        <LockPersonIcon
          sx={{
            fontSize: 100,
            textAlign: "center",
            margin: "auto",
            display: "block",
          }}
        />
        <br /> <br />
        <form onSubmit={handleSubmit(handleSignIn)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <Grid className={"form-flex"}>
            <TextInput
              id={"email"}
              type={"email"}
              placeholder={"Email"}
              value={email}
              require={true}
              handleChangeTextInput={(e) => setEmail(e)}
            />
          </Grid>
          <br />
          <Grid className={"form-flex"}>
            <TextInput
              id={"senha"}
              type={"password"}
              placeholder={"Senha"}
              value={senha}
              require={true}
              handleChangeTextInput={(e) => setSenha(e)}
            />
          </Grid>

          <div className="flex items-center justify-between">
            <Button type="submit" variant="contained" className={"btnLogin"}>
              Entrar
            </Button>
          </div>
        </form>
      </Grid>
    </Grid>
  );
}
