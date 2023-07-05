import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTransformRule } from "../../../../store";
import { useState } from "react";

const TransformAccordion = ({ children, panelID, transformIndex, functionName }) => {
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(true);
  
  return (
    <Box paddingTop={1}>
      <Accordion expanded={expand}>
        <AccordionSummary
          onClick={() => setExpand(!expand)}
          expandIcon={
            <IconButton size="small" color="secondary">
              <ExpandMore />
            </IconButton>
          }
          sx={{ display: "flex", height: "50px" }}
        >
          <Typography variant="body2" sx={{ flexGrow: 1, p: 1 }}>
            {functionName}
          </Typography>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => dispatch(deleteTransformRule({ panelID, transformIndex }))}
          >
            <Delete />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "#323232",
            display: "flex",
          }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TransformAccordion;
