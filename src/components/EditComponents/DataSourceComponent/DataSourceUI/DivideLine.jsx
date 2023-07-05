import { Divider } from "@mui/material";
import React from "react";

const DivideLine = () => {
  return (
    <Divider
      sx={{
        backgroundColor: "white",
        borderBottomWidth: 1,
        width: "100%",
        textAlign: "center",
        marginTop: "1rem",
      }}
    />
  );
};

export default DivideLine;
