import { Box } from '@mui/material'
import React from 'react'
import RechartPanelSetting from './RechartPanelSetting'
import RechartAxisSetting from './RechartAxisSetting'
import RechartLegendSetting from './RechartLegendSetting'
import LineStyleSetting from './LineStyleSetting'

const LineChartSetting = ({ children, isTimeSeries = false }) => {
  return (
    <Box>
      {children}
      <RechartPanelSetting />
      <LineStyleSetting isTimeSeries={isTimeSeries} />
      <RechartAxisSetting />
      <RechartLegendSetting />
    </Box>
  )
}

export default LineChartSetting
