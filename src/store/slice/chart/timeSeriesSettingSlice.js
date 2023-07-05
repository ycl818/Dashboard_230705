import { createSlice } from "@reduxjs/toolkit"
import { setBarLayout } from "./barSettingSlice"
import { setLineLayout } from "./lineSettingSlice"

const initialState = {
  value: {
    chartStyle: 'Line', // Bar, Line, Area, Compose,
    timeFrame: { interval: 'Last 1 hour', format: 'hr:min', value: 60 * 60 * 1000 }
  },
  type_options: ['Bar', 'Line', 'Area']
}

export const timeSeriesSettingSlice = createSlice({
  name: 'timeSeriesSetting',
  initialState,
  reducers: {
    setTimeSeriesStyle: (state, action) => {
      // action.payload => 'Line'
      state.value.chartStyle = action.payload
    },
    setTimeFrame: (state, action) => {
      // action.payload => 'Line'
      state.value.timeFrame = action.payload
    },
    setTimeSeriesSetting: (state, action) => {
      // action.payload => {...all setting}
      state.value = action.payload
    },
    clearTimeSeriesSetting: (state, action) => {
      state.value = initialState.value
    }
  }
})

export const {
  setTimeSeriesStyle,
  setTimeFrame,
  setTimeSeriesSetting,
  clearTimeSeriesSetting
} = timeSeriesSettingSlice.actions

export const timeSeriesSettingReducer = timeSeriesSettingSlice.reducer