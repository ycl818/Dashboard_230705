import { Box } from "@mui/material";

export const StyledTagBox = ({ children }) => {
  return (
    <Box
      sx={{
        "& .MuiOutlinedInput-input": {
          padding: "5px 14px",
        },
        "& .MuiOutlinedInput-root": {
          padding: 0,
        },
        "& .MuiChip-root": {
          backgroundColor: "#181B1F",
        },

        minWidth: 500,
        marginLeft: "0.5rem",
      }}
    >
      {children}
    </Box>
  );
};
