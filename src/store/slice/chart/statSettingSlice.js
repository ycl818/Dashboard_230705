import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    calculation: "mean",
    unit: "",
    withArea: true,
    colorMode: "background",
    setThreshold: false,
    baseColor: "gray",
    threshold: {
      gray: null,
      green: null,
      yellow: null,
      red: null,
    },
  },
};

export const statSettingSlice = createSlice({
  name: "statSetting",
  initialState,
  reducers: {
    setStatStyle: (state, action) => {
      // action.payload => [{type: 'string', value: ...}]
      // string of type must be same as key in value
      state.value[action.payload.type] = action.payload.value;
    },
    // setStatThreshold: (state, action) => {
    //   // action.payload => {color: '', value: ...}
    //   state.value.threshold[action.payload.color] = !Number.isNaN(
    //     Number(action.payload.value)
    //   )
    //     ? Number(action.payload.value)
    //     : null;
    // },
    setStatSetting: (state, action) => {
      // action.payload => {...all setting}
      state.value = action.payload;
    },
    clearStatSetting: (state, action) => {
      state.value = initialState.value;
    },
  },
});

export const {
  setStatStyle,
  setStatThreshold,
  setStatSetting,
  clearStatSetting,
} = statSettingSlice.actions;

export const statSettingReducer = statSettingSlice.reducer;
