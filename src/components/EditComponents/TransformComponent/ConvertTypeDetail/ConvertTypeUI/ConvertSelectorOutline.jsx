import { FormControl } from "@mui/material";

export const ConvertSelectorOutline = ({ children }) => {
  return (
    <FormControl
      sx={{
        m: 0.5,
        minWidth: 200,
        "& .MuiOutlinedInput-input": {
          padding: "5px 14px",
        },
      }}
    >
      {children}
    </FormControl>
  );
};
