import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTimeSeriesStyle } from '../../../store'

const TimeSeriesStyleSetting = () => {
  const dispatch = useDispatch()
  const { chartStyle, type_options } = useSelector((state) => {
    return {
      chartStyle: state.timeSeriesSetting.value.chartStyle,
      type_options: state.timeSeriesSetting.type_options
    }
  })
  
  const [accordionExpand, setAccordionExpand] = useState(true)
  return (
    <Accordion expanded={accordionExpand} onChange={() => setAccordionExpand(!accordionExpand)} disableGutters={true}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Chart Select</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* <Box sx={{ p: 1.5, border: 1, borderColor: '#333333', borderRadius: 1 }}> */}
          <ToggleButtonGroup
            value={chartStyle}
            exclusive
            size='small'
            onChange={(e) => dispatch(setTimeSeriesStyle(e.target.value))}
          >
            {type_options.map((option) => <ToggleButton value={option} key={option}>{option}</ToggleButton>)}
          </ToggleButtonGroup>
        {/* </Box> */}
      </AccordionDetails>
    </Accordion>
  )
}

export default TimeSeriesStyleSetting
