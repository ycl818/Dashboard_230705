import { Box } from "@mui/material";

export const StyledFilterByNameBox = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#181B1F",
        padding: "0.5rem 1rem",
        margin: "0.3rem",
        borderRadius: "1rem",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.1)",
          color: "#5984BE",
        },
        transition: "all 0.5s",
      }}
    >
      {children}
    </Box>
  );
};
