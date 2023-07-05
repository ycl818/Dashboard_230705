import { Box } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAreaLayout, setBarLayout, setLineLayout } from '../../../store'
import AreaChartSetting from './AreaChartSetting'
import BarChartSetting from './BarChartSetting'
import LineChartSetting from './LineChartSetting'
import TimeSeriesStyleSetting from './TimeSeriesStyleSetting'

const TimeSeriesSetting = () => {
  const dispatch = useDispatch()
  const chartStyle = useSelector((state) => state.timeSeriesSetting.value.chartStyle)
  const setting_switcher = () => {
    switch (chartStyle) {
      case 'Line':
        dispatch(setLineLayout({value: 'horizontal', isCompose: false}))
        return <LineChartSetting isTimeSeries={true}><TimeSeriesStyleSetting /></LineChartSetting>
      case 'Bar':
        dispatch(setBarLayout({value: 'horizontal', isCompose: false}))
        return <BarChartSetting isTimeSeries={true}><TimeSeriesStyleSetting /></BarChartSetting>
      case 'Area':
        dispatch(setAreaLayout({value: 'horizontal', isCompose: false}))
        return <AreaChartSetting isTimeSeries={true}><TimeSeriesStyleSetting /></AreaChartSetting>
      default:
        break;
    }
  }
  return (
    <>
      {/* <TimeSeriesStyleSetting /> */}
      {setting_switcher()}
    </>
  )
}

export default TimeSeriesSetting
