import { Button } from "@mui/material";

export const StyledSortByLabel = ({ children }) => {
  return (
    <Button
      disableRipple
      disableFocusRipple
      disableElevation
      sx={{
        color: "#5B9AFF",
        backgroundColor: "#181B1F",
        padding: "0rem 2rem",
        marginRight: "0.2rem",
        height: "33px",
        textTransform: "none",
        minWidth: "100px",
        justifyContent: "flex-start",
        "&:hover": { backgroundColor: "#181B1F", cursor: "auto" },
        "& .MuiButtonBase-root": {
          margin: 0,
        },
      }}
      variant="contained"
    >
      {children}
    </Button>
  );
};
