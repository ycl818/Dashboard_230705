import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  setColumnName,
  setColumnSelect,
  setDefaultColumnSelect,
  updateData,
} from "../widgetSlice";

const initialState = {
  value: {
    xKey: "",
    yKey: [],
    keysColor: [],
    // allKeys: [],
    // data: [],
    chartType: "Line Chart",
  },
  allChartType: [
    "Line Chart",
    "Area Chart",
    "Bar Chart",
    "Compose Chart",
    "Time Series",
    "Stat",
    "Pie Chart",
    "Table",
  ],
};

export const chartDataSlice = createSlice({
  name: "chartData",
  initialState,
  reducers: {
    setXKey: (state, action) => {
      state.value.xKey = action.payload;
    },
    setYKey: (state, action) => {
      state.value.yKey = action.payload;
    },
    setKeysColor: (state, action) => {
      state.value.keysColor = action.payload;
    },
    setKeysColorEdit: (state, action) => {
      // action.payload = {key: 'string', color: '#xxxxxx'}
      const key_idx = state.value.keysColor.findIndex(
        (key_color) => key_color.key === action.payload.key
      );
      if (key_idx === -1) {
        state.value.keysColor.push(action.payload);
      } else {
        state.value.keysColor[key_idx].color = action.payload.color;
      }
      // state.value.keysColor
    },
    setChartType: (state, action) => {
      state.value.chartType = action.payload;
    },
    clearChartData: (state, action) => {
      state.value = initialState.value;
    },
  },
});

export const {
  setXKey,
  setYKey,
  setKeysColor,
  setKeysColorEdit,
  setChartType,
  clearChartData,
} = chartDataSlice.actions;
export const chartDataReducer = chartDataSlice.reducer;
