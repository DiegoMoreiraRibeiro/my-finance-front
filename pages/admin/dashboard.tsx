import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Breadcrumbs, Grid, Link, Paper, Typography } from "@mui/material";
import Theme from "../../components/views/theme";
import { ReactElement } from "react";
import { setCookie, parseCookies } from "nookies";
import { DateToISO, NumberToCurrecy } from "../../components/utils/Format";
import { Get } from "../../services/api";
import dynamic from "next/dynamic";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { "nextauth.id": id } = parseCookies();
  const [valorEntrada, setValorEntrada] = useState(0);
  const [valorSaida, setValorSaida] = useState(0);
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  useEffect(() => {
    listarMovimentacoes();
    initRelatorio();
  });

  async function listarMovimentacoes(): Promise<void> {
    const dateFinal = DateToISO(new Date());

    const ret = await Get(
      "movimentacao/usuario-data/",
      id.toString() + "/" + dateFinal.toString()
    );

    if (ret.status == 200) {
      setValorEntrada(ret.data.Entrada);
      setValorSaida(ret.data.Saida);
    }
  }

  async function initRelatorio(): Promise<void> {
    if (dadosRelatorio.length == 0) {
      const ano = new Date().getFullYear();
      const ret = await Get(
        "relatorio/usuario-ano/",
        id.toString() + "/" + ano
      );

      if (ret.status == 200) {
        setDadosRelatorio(ret.data);
      }
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/admin/dashboard">
                Admin
              </Link>
              <Typography color="text.primary">Dashboard</Typography>
            </Breadcrumbs>
            <Grid className={"gridContainerDash"}>
              <Grid item xs={6} md={6} lg={6} className={"gridEntrada"}>
                <div className={"lbValor"}>
                  {valorEntrada == 0
                    ? "R$ 0,00"
                    : NumberToCurrecy(valorEntrada)}
                </div>
                <span>Entrada / Mês</span>
              </Grid>
              <Grid item xs={6} md={6} lg={6} className={"gridSaida"}>
                <div className={"lbValor"}>
                  {valorSaida == 0 ? "R$ 0,00" : NumberToCurrecy(valorSaida)}
                </div>
                <span>Saída / Mês</span>
              </Grid>
            </Grid>
            <Grid className={"gridContainerReport"}>
              <Grid item xs={12} md={12} lg={12}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dadosRelatorio}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entrada" fill="#79F479" />
                    <Bar dataKey="saida" fill="#B36060" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>{" "}
    </>
  );
}

export default Dashboard;
