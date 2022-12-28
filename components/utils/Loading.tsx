import {
  Box,
  CircularProgress,
  Grid,
  LinearProgress,
  Snackbar,
} from "@mui/material";

export default function Loading(props: any) {
  return (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <CircularProgress />
    </Snackbar>
  );
}
