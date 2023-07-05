import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ChartNameField from "./EditComponents/ChartNameField";
import GraphTypeSwitcher from "./GraphTypeSwitcher";
import React from "react";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import DataPanelTable from "./EditComponents/DataSourceComponent/DataPanelTable";
import { AccessTime, Refresh } from "@mui/icons-material";
import { setDataLimit, setTimeFrame } from "../store";

const GraphBolck = ({ panelID }) => {
  const {
    chartType,
    chartSetting,
    chartData,
    chartX,
    chartY,
    dataLimit,
    typeOfData,
  } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    const chartType = state.chartData.value.chartType;

    let chartStyleSetting = {};
    let chartOtherSetting = {};

    switch (chartType) {
      case "Bar Chart":
        chartStyleSetting = state.barSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Line Chart":
        chartStyleSetting = state.lineSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Area Chart":
        chartStyleSetting = state.areaSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Pie Chart":
        chartStyleSetting = state.pieSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Compose Chart":
        chartStyleSetting = {
          keys: state.composeSetting.value,
          BarSetting: state.barSetting.value,
          LineSetting: state.lineSetting.value,
          AreaSetting: state.areaSetting.value,
        };
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Time Series":
        chartStyleSetting = {
          setting: state.timeSeriesSetting.value,
          BarSetting: state.barSetting.value,
          LineSetting: state.lineSetting.value,
          AreaSetting: state.areaSetting.value,
          // ...
        };
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Stat":
        chartStyleSetting = state.statSetting.value;
        chartOtherSetting = {};
        break;
      // case "Table":
      //   chartStyleSetting = state.tableSetting.value

      default:
        chartStyleSetting = {};
        chartOtherSetting = {};
        break;
    }
    return {
      chartType: chartType,
      chartSetting: {
        style: chartStyleSetting,
        other: chartOtherSetting,
        keysColor: state.chartData.value.keysColor,
      },
      chartData: targetPanel[0]?.chart_data,
      chartX: state.chartData.value.xKey,
      chartY: state.chartData.value.yKey,
      dataLimit: targetPanel[0]?.data_limit,
      typeOfData: targetPanel[0]?.typeOfData,
    };
  });
  const dispatch = useDispatch();

  let chart_data = [];
  if (chartData.length > 0) {
    chart_data = chartData[0].dataTable; /////////////// 不確定是否永遠 [0]
  }
  let keysArry = [];
  if (chart_data && chart_data.length > 0) {
    keysArry = Object.keys(chart_data[0]);
  }

  const dataKey =
    chartY.length !== 0
      ? chartY
      : keysArry.length === 0
      ? []
      : keysArry.length === 1
      ? [keysArry[0]]
      : keysArry.slice(1);

  const XaxisName =
    chartX !== "" ? chartX : keysArry.length === 0 ? "" : keysArry[0];

  /*******************************/
  const [checked, setChecked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [table, setTable] = useState("");

  useEffect(() => {
    if (chartData.length > 0 && table === "") {
      setTable(chartData[0].dataName);
    }
  }, [chartData]);

  const handleChangeTable = (event) => {
    setTable(event.target.value);
  };
  /*******************************/
  const time_frame = [
    { interval: "Last 5 minutes", value: 5 * 60 * 1000 },
    { interval: "Last 10 minutes", value: 10 * 60 * 1000 },
    { interval: "Last 15 minutes", value: 15 * 60 * 1000 },
    { interval: "Last 30 minutes", value: 30 * 60 * 1000 },
    { interval: "Last 1 hour", value: 60 * 60 * 1000 },
    { interval: "Last 3 hours", value: 3 * 60 * 60 * 1000 },
    { interval: "Last 6 hours", value: 6 * 60 * 60 * 1000 },
    { interval: "Last 12 hours", value: 12 * 60 * 60 * 1000 },
    { interval: "Last 24 hours", value: 24 * 60 * 60 * 1000 },
    { interval: "Last 2 days", value: 2 * 24 * 60 * 60 * 1000 },
    { interval: "Last 7 days", value: 7 * 24 * 60 * 60 * 1000 },
    { interval: "Last 30 days", value: 30 * 24 * 60 * 60 * 1000 },
    { interval: "Last 90 days", value: 90 * 24 * 60 * 60 * 1000 },
    { interval: "Last 6 months", value: 182.5 * 24 * 60 * 60 * 1000 },
    { interval: "Last 1 years", value: 365 * 24 * 60 * 60 * 1000 },
  ];

  // console.log(chartSetting.style.setting)
  let timeFrameSelector = (
    <FormControl sx={{ marginRight: "0.5rem" }}>
      <Select
        value={chartSetting.style?.setting?.timeFrame}
        renderValue={(value) => (
          <>
            <AccessTime /> {value.interval}
          </>
        )}
        onChange={(e) => {
          dispatch(setTimeFrame(e.target.value));
        }}
        size="small"
      >
        {time_frame.map((time) => (
          <MenuItem key={time.value} value={time}>
            {time.interval}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const data_limit = [10, 20, 50, 100, 200, 500, 1000, 2000];
  let dataLimitSelector = (
    <FormControl sx={{ marginRight: "0.5rem" }}>
      <InputLabel>Max data points</InputLabel>
      <Select
        label="Max data points"
        value={dataLimit}
        onChange={(e) => {
          dispatch(setDataLimit({ panelID: panelID, limit: e.target.value }));
        }}
        size="small"
        sx={{ minWidth: 115 }}
      >
        {data_limit.map((limit) => (
          <MenuItem key={limit} value={limit}>
            {limit}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  let chart_setting = (
    <Box
      paddingRight={3}
      sx={{
        marginBottom: "1rem",
        marginTop: "0.3rem",
      }}
    >
      {dataLimitSelector}
      {chartType === "Time Series" ? timeFrameSelector : null}
      <Tooltip title="Refresh">
        <IconButton
          onClick={() => setRefreshKey((prev) => !prev)}
          // size='small'
          // variant='outlined'
          color="primary"
        >
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  );

  let tableSelector = (
    <FormControl
      sx={{
        minWidth: 120,
        marginBottom: "1rem",
        marginTop: "0.3rem",
      }}
    >
      <InputLabel>Table</InputLabel>
      {chartData.length > 0 ? (
        <Select
          sx={{ padding: 0 }}
          value={table}
          label="Table"
          onChange={handleChangeTable}
          size="small"
        >
          {chartData.map((data, idx) => (
            <MenuItem key={idx} value={data.dataName}>
              {data.dataLabel}
            </MenuItem>
          ))}
        </Select>
      ) : null}
    </FormControl>
  );
  let tableTypes = null;
  if (chartData.length) {
    tableTypes = chartData.map((data, idx) => {
      if (data.dataName === table)
        return (
          <Box key={idx} paddingRight={2} paddingLeft={2}>
            {data.dataTable && Array.isArray(data.dataTable) && (
              <DataPanelTable
                data={data.dataTable}
                // panelID={panelID}
                // dataPanelID={data.dataName}
              />
            )}
          </Box>
        );
    });
  }

  const Switcher = () => {
    return (
      <FormControlLabel
        sx={{ marginLeft: "0.2rem" }}
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
            size="small"
          />
        }
        label="Table View"
      />
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Switcher />
        {checked && chartData.length > 0 ? tableSelector : ""}
        {/* {!checked && chartType === 'Time Series' ? timeFrameSelector : null} */}
        {!checked ? chart_setting : null}
      </Box>
      {checked && tableTypes}
      {!checked && chart_data.length > 0 && dataKey.length > 0 && (
        <Box
          component="div"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
          p={2}
        >
          <ChartNameField panelID={panelID} />
          <GraphTypeSwitcher
            key={refreshKey}
            type={chartType}
            data={chart_data}
            XaxisName={XaxisName}
            dataKey={dataKey}
            // dataKey={keysArry.slice(1) || "name"} // 這邊之後應該要換成chartData的yKey
            chartSetting={chartSetting}
            dataLimit={dataLimit}
            editPage={true}
            // isStreaming={typeOfData === 'Streaming'}
            // XaxisName={keysArry[0] || "hi"} // 這邊之後應該要換成chartData的xKey
          />
        </Box>
      )}
      {!checked && (!chart_data.length || dataKey.length === 0) && (
        <p style={{ textAlign: "center" }}>No Data to draw</p>
      )}
    </>
  );
};

export default React.memo(GraphBolck);
