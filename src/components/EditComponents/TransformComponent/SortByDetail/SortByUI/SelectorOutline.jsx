import { FormControl } from "@mui/material";

export const SelectorOutline = ({ children }) => {
  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 700,
        "& .MuiOutlinedInput-input": {
          padding: "5px 14px",
        },
      }}
    >
      {children}
    </FormControl>
  );
};
