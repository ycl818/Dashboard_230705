import { BorderColor, Close } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setXKey, setYKey } from "../../../store/slice/chart/chartDataSlice";

const AxisSelector = ({ panelID }) => {
  const dispatch = useDispatch();
  const { chartX, chartY, chartType, chartData } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    return {
      chartX: state.chartData.value.xKey,
      chartY: state.chartData.value.yKey,
      chartType: state.chartData.value.chartType,
      chartData: targetPanel[0]?.chart_data,
    };
  });

  console.log(
    "🚀 ~ file: AxisSelector.jsx:28 ~ const{chartX,chartY,chartType,chartData}=useSelector ~ chartY:",
    chartY
  );
  const y_single_chart = ["Pie Chart", "Stat"];

  let chart_data = [];
  if (chartData.length > 0) {
    chart_data = chartData[0].dataTable; /////////////// 不確定是否永遠 [0]
  }
  let keysArry = [];
  if (chart_data && chart_data.length > 0) {
    keysArry = Object.keys(chart_data[0]);
  }

  const [xAxis, setXaxis] = useState(chartX);
  const [yAxis, setYaxis] = useState(chartY);

  useEffect(() => {
    if (chartType === "Time Series") setXaxis(chartX);
  }, [chartX]);

  useEffect(() => {
    if (y_single_chart.includes(chartType)) setYaxis([chartY[0]]);
  }, [chartY]);
  // console.log('keysArry', keysArry, 'xAxis', xAxis)

  return (
    <Box>
      {chartType !== "Table" ? (
        <Stack
          spacing={2}
          direction="column"
          alignItems="left"
          sx={{ p: 1, mt: 2, mb: 1 }}
        >
          <FormControl size="small" fullWidth>
            <FormLabel>X-Axis Select</FormLabel>
            <Select
              error={xAxis !== "" && !keysArry.includes(xAxis)}
              renderValue={(value) => (value === "" ? <em>default</em> : value)}
              value={xAxis}
              displayEmpty
              disabled={chartType === "Time Series" ? true : false}
              onClick={(e) => {
                if (chartType !== "Time Series") {
                  if (e.target.textContent === xAxis) {
                    setXaxis("");
                    dispatch(setXKey(""));
                  } else if (
                    e.target.textContent !== "" &&
                    e.target.value !== undefined
                  ) {
                    setXaxis(e.target.textContent);
                    dispatch(setXKey(e.target.textContent));
                  }
                }
              }}
              sx={{
                "& .MuiSelect-iconOutlined": {
                  display: xAxis !== "" ? "none" : "",
                },
                "&.Mui-focused .MuiIconButton-root": { color: "primary.main" },
              }}
              endAdornment={
                <IconButton
                  size="small"
                  onClick={() => {
                    if (chartType !== "Time Series") {
                      setXaxis("");
                      dispatch(setXKey(""));
                    }
                  }}
                  sx={{ visibility: xAxis !== "" ? "visible" : "hidden" }}
                >
                  <Close />
                </IconButton>
              }
            >
              {keysArry.map((k, i) => (
                <MenuItem key={"x_" + k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <FormLabel>Y-Axis Select</FormLabel>
            <Select
              error={
                yAxis.length !== 0 && !yAxis.every((k) => keysArry.includes(k))
              }
              // multiple
              multiple={y_single_chart.includes(chartType) ? false : true}
              displayEmpty
              renderValue={(value) => {
                if (value.length === 0) {
                  return <em>default</em>;
                }
                return value.join(", ");
              }}
              value={yAxis}
              onChange={(e) => {
                // const selected_y = e.target.value.filter((y) => keysArry.includes(y))
                const selected_y = y_single_chart.includes(chartType)
                  ? [e.target.value]
                  : e.target.value.filter((y) => keysArry.includes(y));

                setYaxis(selected_y);
                dispatch(setYKey(selected_y));
              }}
              sx={{
                "& .MuiSelect-iconOutlined": {
                  display: yAxis.length !== 0 ? "none" : "",
                },
                "&.Mui-focused .MuiIconButton-root": { color: "primary.main" },
              }}
              endAdornment={
                <IconButton
                  size="small"
                  onClick={() => {
                    setYaxis([]);
                    dispatch(setYKey([]));
                  }}
                  sx={{ visibility: yAxis.length !== 0 ? "visible" : "hidden" }}
                >
                  <Close />
                </IconButton>
              }
            >
              {keysArry.map((k, i) => (
                <MenuItem key={"y_" + k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      ) : null}
    </Box>
  );
};

export default React.memo(AxisSelector);
