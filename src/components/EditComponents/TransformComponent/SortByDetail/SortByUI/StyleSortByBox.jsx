import { Box } from "@mui/material";
import React from "react";

const StyleSortByBox = ({ children }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "100%" }}
    >
      {children}
    </Box>
  );
};

export default StyleSortByBox;
