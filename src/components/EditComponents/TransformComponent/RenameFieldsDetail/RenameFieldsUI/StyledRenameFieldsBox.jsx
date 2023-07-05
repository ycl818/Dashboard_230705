import { Box } from "@mui/material";

export const StyledRenameFieldsBox = ({ children }) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        overflow: "auto",
      }}
    >
      <Box
        className="left_part"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
