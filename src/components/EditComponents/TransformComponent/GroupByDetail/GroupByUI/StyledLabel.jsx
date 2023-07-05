import { Button } from "@mui/material";

export const StyledLabel = ({ children }) => {
  return (
    <Button
      disableRipple
      disableFocusRipple
      disableElevation
      sx={{
        color: "#5B9AFF",
        backgroundColor: "#181B1F",
        marginBottom: "0.3rem",
        padding: "0.5rem",
        marginRight: "1rem",
        textTransform: "none",
        minWidth: "230px",
        justifyContent: "flex-start",
        "&:hover": { backgroundColor: "#181B1F", cursor: "auto" },
      }}
      variant="contained"
    >
      {children}
    </Button>
  );
};
