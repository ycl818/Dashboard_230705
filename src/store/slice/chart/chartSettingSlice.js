import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  value: {
    Recharts: {
      RechartPanel: {
        stroke: "3 3",
        strokeOpacity: 0.1,
      },
      RechartXaxis: {
        // type: 'category',
        hide: false,
        orientation: "bottom",
        textAnchor: "middle",
        // interval: 0,
        angle: 0,
        fontSize: 15,
        // padding: { left: 0, right: 0 },
        label_hide: true,
        label_value: "x-axis",
        label_position: "insideBottom",
      },
      RechartYaxis: {
        // type: 'number',
        hide: false,
        orientation: "left",
        textAnchor: "end",
        // interval: 0,
        angle: 0,
        fontSize: 15,
        // padding: { top: 0, bottom: 0 },
        label_hide: true,
        label_value: "y-axis",
        label_position: "insideLeft",
      },
      RechartTooltip: {},
      RechartLegend: {
        show: true,
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
        iconType: "line",
      },
    },
  },
  color: [
    "#d88484",
    "#f44336",
    "#e91e63",
    "#974dbf",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
  ],
};

export const chartSettingSlice = createSlice({
  name: "chartSetting",
  initialState,
  reducers: {
    setRechartPanel: (state, action) => {
      state.value.Recharts.RechartPanel[action.payload.type] =
        action.payload.value;
    },
    setRechartXaxis: (state, action) => {
      // action.payload => [{type: 'string', value: ...}]
      // string of type must be same as key in RechartXaxis
      state.value.Recharts.RechartXaxis[action.payload.type] =
        action.payload.value;
    },
    setRechartYaxis: (state, action) => {
      state.value.Recharts.RechartYaxis[action.payload.type] =
        action.payload.value;
    },
    setRechartTooltip: (state, action) => {},
    setRechartLegend: (state, action) => {
      state.value.Recharts.RechartLegend[action.payload.type] =
        action.payload.value;
    },
    setChartSetting: (state, action) => {
      // action.payload => {type: 'string (Recharts)', setting: {...all setting}}
      state.value[action.payload.type] = action.payload.setting;
    },
    clearChartSetting: (state, action) => {
      state.value = initialState.value;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addMatcher(isAnyOf(setBarLayout, setAreaLayout), (state, action) => {
  //       if (action.payload === 'horizontal') {
  //         state.value.RechartXaxis.type = 'category'
  //         state.value.RechartYaxis.type = 'number'
  //       } else if (action.payload === 'vertical') {
  //         state.value.RechartXaxis.type = 'number'
  //         state.value.RechartYaxis.type = 'category'
  //       }
  //     })
  // }
});

export const {
  setRechartPanel,
  setRechartXaxis,
  setRechartYaxis,
  setRechartLegend,
  setChartSetting,
  clearChartSetting,
} = chartSettingSlice.actions;

export const chartSettingReducer = chartSettingSlice.reducer;
