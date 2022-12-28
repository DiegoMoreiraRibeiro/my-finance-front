import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Router from "next/router";
import PaidIcon from "@mui/icons-material/Paid";
function redirectLink(link: string): any {
  Router.push(link);
}

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText
        onClick={() => redirectLink("dashboard")}
        primary="Dashboard"
      />
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <PaidIcon />
      </ListItemIcon>
      <ListItemText
        onClick={() => redirectLink("movimentacoes")}
        primary="Movimentações"
      />
    </ListItemButton>
  </React.Fragment>
);
