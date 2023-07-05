import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { setChartType, setXKey, setYKey, updateDataType } from "../../store";
import { Box, InputAdornment, ListItemIcon, ListItemText } from "@mui/material";
import {
  FcBarChart,
  FcLineChart,
  FcAreaChart,
  FcPieChart,
  FcComboChart,
  FcTimeline,
  FcGrid,
  FcStatistics,
} from "react-icons/fc";

const ComboBox = ({ panelID }) => {
  const chartData = useSelector((state) => state.chartData);
  console.log("🚀 ~ file: ComboBox.jsx:20 ~ ComboBox ~ chartData:", chartData);

  const chartIcons = [
    {
      name: "Bar Chart",
      icon: <FcBarChart />,
    },
    {
      name: "Line Chart",
      icon: <FcLineChart />,
    },
    {
      name: "Area Chart",
      icon: <FcAreaChart />,
    },
    {
      name: "Pie Chart",
      icon: <FcPieChart />,
    },
    {
      name: "Compose Chart",
      icon: <FcComboChart />,
    },
    {
      name: "Time Series",
      icon: <FcTimeline />,
    },
    {
      name: "Table",
      icon: <FcGrid />,
    },
    {
      name: "Stat",
      icon: <FcStatistics />,
    },
  ];
  const y_single_chart = ["Pie Chart", "Stat"];

  const dispatch = useDispatch();

  return (
    <Autocomplete
      disablePortal
      disableClearable
      id="combo-box"
      // options={charts}
      options={chartData.allChartType}
      value={chartData.value.chartType}
      sx={{
        width: "100%",
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "white",
        },
      }}
      renderInput={(params) => {
        let icons = Object.values(chartIcons).map((chart) => {
          if (chart.name === params.inputProps.value) return chart.icon;
        });

        return (
          <Box>
            <TextField
              {...params}
              label="Charts"
              disabled
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ fontSize: "2rem" }}>
                    {icons}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      }}
      renderOption={(props, option) => {
        let icons = Object.values(chartIcons).map((chart) => {
          if (chart.name === option) return chart.icon;
        });
        return (
          <Box {...props} bgcolor="#0f1524">
            <ListItemIcon sx={{ fontSize: "2rem" }}>{icons}</ListItemIcon>

            <ListItemText primary={option} />
          </Box>
        );
      }}
      onChange={(e) => {
        // dispatch({
        //   type: "CHANGE_CHART_TYPE",
        //   payload: e.target.textContent,
        // });
        const selectedType = e.target.textContent;
        dispatch(setChartType(selectedType));
        if (selectedType === "Time Series") dispatch(setXKey("timestamp "));

        if (
          y_single_chart.includes(selectedType) &&
          chartData.value.yKey.length > 1
        )
          dispatch(setYKey([chartData.value.yKey[0]]));
        // dispatch1(updateDataType({ selectedType, panelID }));
      }}
    />
  );
};

export default ComboBox;
