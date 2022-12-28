import { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";

export default function Msg(props: any) {
  const [showMsg, setShowMsg] = useState(false);
  const { desc, active, handleClose, type } = props;

  useEffect(() => {
    if (active) setShowMsg(true);
    else setShowMsg(false);
  }, [active]);

  function onCloseSnack() {
    setShowMsg(false);
    return handleClose();
  }

  function getType() {
    if (type == "error") {
      return {
        sx: {
          background: "#FF6347",
        },
      };
    } else if ("success") {
      return {
        sx: {
          background: "#32CD32",
        },
      };
    }
  }

  return (
    <Snackbar
      open={showMsg}
      autoHideDuration={5000}
      onClose={onCloseSnack}
      message={desc}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      ContentProps={getType()}
    />
  );
}
