import { Refresh } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useRef } from "react";
import { useState } from "react";

const Refreshbtn = ({ index }) => {
  const refreshKeys = useRef(false);

  const handleClick = () => {
    refreshKeys.current = !refreshKeys.current;
    console.log(
      "🚀 ~ file: Refreshbtn.jsx:13 ~ handleClick ~   refreshKeys.current:",
      refreshKeys.current,
      index
    );
  };

  return (
    <Tooltip title="Refresh">
      <IconButton
        sx={{ position: "absolute", right: "0" }}
        onClick={handleClick}
        size="small"
      >
        <Refresh color="primary" fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default Refreshbtn;
