import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Breadcrumbs, Grid, Link, Paper, Typography } from "@mui/material";
import Theme from "../../components/views/theme";
import { ReactElement } from "react";
import { setCookie, parseCookies } from "nookies";
import { DateToISO, NumberToCurrecy } from "../../components/utils/Format";
import { Get } from "../../services/api";
import { Chart } from "react-google-charts";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { "nextauth.id": id } = parseCookies();
  const [valorEntrada, setValorEntrada] = useState(0);
  const [valorSaida, setValorSaida] = useState(0);

  useEffect(() => {
    listarMovimentacoes();
  });

  const dataEntrada = [
    ["Ano 2023", "Entrada"],
    ["Jan", 1000],
    ["Fev", 1170],
    ["Mar", 660],
    ["Abr", 1030],
  ];

  const dataSaida = [
    ["Ano 2023", "Saída"],
    ["Jan", 1000],
    ["Fev", 1170],
    ["Mar", 660],
    ["Abr", 1030],
  ];

  const optionsEntrada = {
    chart: {
      title: "Relatório anual por mês / Entrada",
    },
  };

  const optionsSaida = {
    chart: {
      title: "Relatório anual por mês / Saída",
      backgroundColor: "#f1f7f9",
    },
  };

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

  return (
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
                {valorEntrada == 0 ? "R$ 0,00" : NumberToCurrecy(valorEntrada)}
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
            <Grid item xs={6} md={6} lg={6}>
              <Chart
                chartType="Bar"
                width="90%"
                height="200px"
                data={dataEntrada}
                options={optionsEntrada}
              />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <Chart
                chartType="Bar"
                width="90%"
                height="200px"
                data={dataSaida}
                options={optionsSaida}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Theme>{page}</Theme>;
};

export default Dashboard;
