import { Button } from "@mui/material";

export const StyleButton = ({ children }) => {
  return (
    <Button
      disableRipple
      disableFocusRipple
      disableElevation
      sx={{
        color: "#5B9AFF",
        backgroundColor: "#181B1F",
        width: "10%",
        marginRight: "1rem",
        "&:hover": { backgroundColor: "#181B1F" },
      }}
      variant="contained"
    >
      {children}
    </Button>
  );
};
