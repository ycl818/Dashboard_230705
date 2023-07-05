import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import DataPanelTable from "../DataSourceComponent/DataPanelTable";
import { cleanChartData } from "./helper/helper";

const TableDisplay = ({ data, dataLimit }) => {
  let data_limit = cleanChartData(data, "original", dataLimit);

  return (
    <Box paddingLeft={2} paddingRight={2} height="100%">
      <DataPanelTable data={data_limit} isChart={true} />
    </Box>
  );
};

export default TableDisplay;
