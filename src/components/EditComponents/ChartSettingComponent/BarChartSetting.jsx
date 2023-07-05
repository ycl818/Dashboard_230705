import { Box } from '@mui/material'
import React from 'react'
import BarStyleSetting from './BarStyleSetting'
import RechartAxisSetting from './RechartAxisSetting'
import RechartLegendSetting from './RechartLegendSetting'
import RechartPanelSetting from './RechartPanelSetting'
import RechartTooltipSetting from './RechartTooltipSetting'

const BarChartSetting = ({ children, isTimeSeries = false }) => {
  return (
    <Box>
      {children}
      <RechartPanelSetting />
      <BarStyleSetting isTimeSeries={isTimeSeries} />
      <RechartAxisSetting />
      <RechartLegendSetting />
      <RechartTooltipSetting />
    </Box>
  )
}

export default BarChartSetting
