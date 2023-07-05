import { Box } from "@mui/material";

export const StyledSelectBox = ({ children }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        "& .MuiOutlinedInput-input": {
          padding: "5px 14px",
        },
        "& .MuiOutlinedInput-root": {
          padding: "0 !important",
        },
        "& .MuiInputBase-root": {
          padding: "0 !important",
        },
      }}
    >
      {children}
    </Box>
  );
};
