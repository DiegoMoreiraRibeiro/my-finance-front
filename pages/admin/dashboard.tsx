import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Breadcrumbs, Grid, Link, Paper, Typography } from "@mui/material";
import Theme from "../../components/views/theme";
import { ReactElement } from "react";
import { setCookie, parseCookies } from "nookies";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { "nextauth.email": email } = parseCookies();
  const { "nextauth.nome": nome } = parseCookies();

  useEffect(() => {
    // api.get('/users');
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/admin/dashboard">
              Admin
            </Link>
            <Typography color="text.primary">Dashboard</Typography>
          </Breadcrumbs>
        </Paper>
      </Grid>
    </Grid>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Theme>{page}</Theme>;
};

export default Dashboard;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const apiClient = getAPIClient(ctx);
//   const { ["nextauth.token"]: token } = parseCookies(ctx);

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   await apiClient.get("/users");

//   return {
//     props: {},
//   };
// };
