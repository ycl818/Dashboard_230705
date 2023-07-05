import React from "react";
// import { ChartTypeSwitcher } from "../ChartTypeSwitcher";
import { Box } from "@mui/material";
import BarChartDisplay from "./EditComponents/ChartDisplayComponent/BarChartDisplay";
import AreaChartDisplay from "./EditComponents/ChartDisplayComponent/AreaChartDisplay";
import PieChartDisplay from "./EditComponents/ChartDisplayComponent/PieChartDisplay";
import LineChartDisplay from "./EditComponents/ChartDisplayComponent/LineChartDisplay";
import ComposeDisplay from "./EditComponents/ChartDisplayComponent/ComposeDisplay";
import TimeSeriesDisplay from "./EditComponents/ChartDisplayComponent/TimeSeriesDisplay";
import TableDisplay from "./EditComponents/ChartDisplayComponent/TableDisplay";
import StatChartDisplay from "./EditComponents/ChartDisplayComponent/StatChartDisplay";

const GraphTypeSwitcher = ({
  type,
  data,
  // width,
  // height,
  XaxisName,
  dataKey,
  // panelID,
  chartSetting,
  dataLimit,
  editPage = false,
}) => {
  const chart_switcher = () => {
    switch (type) {
      case "Bar Chart":
        return (
          <BarChartDisplay
            data={data}
            xKey={XaxisName}
            yKey={dataKey}
            styleSetting={chartSetting.style}
            otherSetting={chartSetting.other}
            dataLimit={dataLimit}
            keysColor={chartSetting.keysColor}
            editPage={editPage}
          />
        );
      case "Line Chart":
        return (
          <LineChartDisplay
            data={data}
            xKey={XaxisName}
            yKey={dataKey}
            styleSetting={chartSetting.style}
            otherSetting={chartSetting.other}
            dataLimit={dataLimit}
            keysColor={chartSetting.keysColor}
            editPage={editPage}
          />
        );
      case "Area Chart":
        return (
          <AreaChartDisplay
            data={data}
            xKey={XaxisName}
            yKey={dataKey}
            styleSetting={chartSetting.style}
            otherSetting={chartSetting.other}
            dataLimit={dataLimit}
            ////////////////////////////////
            keysColor={chartSetting.keysColor}
            editPage={editPage}
          />
        );
      case "Pie Chart":
        return (
          <PieChartDisplay
            data={data}
            xKey={XaxisName}
            yKey={dataKey}
            styleSetting={chartSetting.style}
            otherSetting={chartSetting.other}
            dataLimit={dataLimit}
            keysColor={chartSetting.keysColor}
            editPage={editPage}
          />
        );
      case "Compose Chart":
        return (
          <ComposeDisplay
            data={data}
            xKey={XaxisName}
            styleSetting={chartSetting.style}
            otherSetting={chartSetting.other}
            dataLimit={dataLimit}
            keysColor={chartSetting.keysColor}
            editPage={editPage}
          />
        );
      case "Time Series":
        return (
          <TimeSeriesDisplay
            data={data}
            yKey={dataKey}
            styleSetting={chartSetting.style}
            otherSetting={chartSetting.other}
            dataLimit={dataLimit}
            keysColor={chartSetting.keysColor}
            editPage={editPage}
          />
        ); // isStreaming={isStreaming}
      case "Table":
        return <TableDisplay data={data} dataLimit={dataLimit} />;
      case "Stat":
        return (
          <StatChartDisplay
            data={data}
            yKey={dataKey}
            styleSetting={chartSetting.style}
            dataLimit={dataLimit}
          />
        );
      default:
        break;
    }
  };

  return (
    // <ChartTypeSwitcher
    //   type={type}
    //   data={data}
    //   width={width}
    //   height={height}
    //   XaxisName={XaxisName}
    //   dataKey={dataKey}
    //   panelID={panelID}
    // />

    <Box
      sx={{
        width: "100%",
        height: "90%",
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        // // borderColor: '#333333'
        // marginTop: "0.3rem",
      }}
    >
      {/* {chart_switcher()} */}
      {data?.length ? chart_switcher() : null}
    </Box>
  );
};

export default GraphTypeSwitcher;
