import { Button } from "@mui/material";

export const StyledConvertTypeLabel = ({ children }) => {
  return (
    <Button
      disableRipple
      disableFocusRipple
      disableElevation
      
      sx={{
        color: "#5B9AFF",
        backgroundColor: "#181B1F",
        // padding: "0rem 2rem",
        m: 0.5,
        // marginRight: "0.2rem",
        // marginBottom: "0.3rem",
        height: "33px",
        textTransform: "none",
        width: "fit-content",
        // minWidth: "50px",
        justifyContent: "flex-center",
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
