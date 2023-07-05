import { Button } from "@mui/material";
import React from "react";

const InspectorButton = ({ setTargetDataPanel, setDrawerOpen, data }) => {
  return (
    <Button
      name={data.dataName}
      variant="contained"
      style={{
        textTransform: "unset",
        marginLeft: "1rem",
      }}
      sx={{
        fontSize: { sm: "10px", lg: "14px" },
        padding: { sm: "10px 0px", lg: "0.5rem" },
        width: { sm: "15%", lg: "20%" },
      }}
      onClick={(e) => {
        setTargetDataPanel(e.target.name);
        setDrawerOpen(true);
      }}
    >
      Query inspector
    </Button>
  );
};

export default InspectorButton;
