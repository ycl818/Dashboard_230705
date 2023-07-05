import { Close, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setComposeKey } from '../../../store'

const ComposeStyleSetting = ({ panelID }) => {
  const dispatch = useDispatch()
  const {chartY, composeSetting, chart_data, keysArry//chartData
  } = useSelector(state => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    const chartData = targetPanel[0]?.chart_data
    const chart_data = chartData.length > 0 ? chartData[0].dataTable : [] /////////////// 不確定是否永遠 [0]
    const keysArry = chart_data && chart_data.length > 0 ? Object.keys(chart_data[0]) : []

    return {
      chartY: state.chartData.value.yKey,
      composeSetting: state.composeSetting.value,
      chart_data: chart_data,
      keysArry: keysArry
    }
  })

  // let chart_data = [];
  // if (chartData.length > 0) {
  //   chart_data = chartData[0].dataTable; /////////////// 不確定是否永遠 [0]
  // }
  // let keysArry = [];
  // if (chart_data && chart_data.length > 0) {
  //   keysArry = Object.keys(chart_data[0]);
  // }

  const yKey = chartY.length !== 0 ? chartY
    : keysArry.length === 0 ? []
      : keysArry.length === 1 ? [keysArry[0]] : keysArry.slice(1,)

  const [accordionExpand, setAccordionExpand] = useState(true)

  // console.log('!!!', yKey)

  useEffect(() => {
    if (!composeSetting.BarKey.every((k) => yKey.includes(k))) {
      dispatch(setComposeKey({ type: 'BarKey', value: composeSetting.BarKey.filter((k) => yKey.includes(k)) }))
    }
    if (!composeSetting.LineKey.every((k) => yKey.includes(k))) {
      dispatch(setComposeKey({ type: 'LineKey', value: composeSetting.LineKey.filter((k) => yKey.includes(k)) }))
    }
    if (!composeSetting.AreaKey.every((k) => yKey.includes(k))) {
      dispatch(setComposeKey({ type: 'AreaKey', value: composeSetting.AreaKey.filter((k) => yKey.includes(k)) }))
    }
  }, [yKey])

  return (
    <Accordion expanded={accordionExpand} onChange={() => setAccordionExpand(!accordionExpand)} disableGutters={true}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Select Keys</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ p: 1.5, border: 1, borderColor: '#333333', borderRadius: 1 }}>
          <Stack spacing={2} direction='row' sx={{mb: 3}} alignItems='left'>
            <Typography variant='body2'>Bar</Typography>
            <Select
              error={composeSetting.BarKey.length !== 0 && !composeSetting.BarKey.every((k) => keysArry.includes(k))}
              renderValue={(value) => value.join(', ')}
              value={composeSetting.BarKey}
              multiple
              fullWidth
              size='small'
              onChange={(e) => dispatch(setComposeKey({ type: 'BarKey', value: e.target.value }))}
              sx={{
                "& .MuiSelect-iconOutlined": { display: composeSetting.BarKey.length !== 0 ? 'none' : '' },
                "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' }
              }}
              endAdornment={
                <IconButton
                  size='small'
                  onClick={() => dispatch(setComposeKey({ type: 'BarKey', value: [] }))}
                  sx={{ visibility: composeSetting.BarKey.length !== 0 ? "visible" : "hidden" }}
                >
                  <Close />
                </IconButton>
              }
            >
              {yKey.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </Stack>

          <Stack spacing={2} direction='row' sx={{mb: 3}} alignItems='left'>
            <Typography variant='body2'>Line</Typography>
            <Select
              error={composeSetting.LineKey.length !== 0 && !composeSetting.LineKey.every((k) => keysArry.includes(k))}
              renderValue={(value) => value.join(', ')}
              value={composeSetting.LineKey}
              multiple
              fullWidth
              size='small'
              onChange={(e) => dispatch(setComposeKey({ type: 'LineKey', value: e.target.value }))}
              sx={{
                "& .MuiSelect-iconOutlined": { display: composeSetting.LineKey.length !== 0 ? 'none' : '' },
                "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' }
              }}
              endAdornment={
                <IconButton
                  size='small'
                  onClick={() => dispatch(setComposeKey({ type: 'LineKey', value: [] }))}
                  sx={{ visibility: composeSetting.LineKey.length !== 0 ? "visible" : "hidden" }}
                >
                  <Close />
                </IconButton>
              }
            >
              {yKey.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </Stack>

          <Stack spacing={2} direction='row' sx={{mb: 3}} alignItems='left'>
            <Typography variant='body2'>Area</Typography>
            <Select
              error={composeSetting.AreaKey.length !== 0 && !composeSetting.AreaKey.every((k) => keysArry.includes(k))}
              renderValue={(value) => value.join(', ')}
              value={composeSetting.AreaKey}
              multiple
              fullWidth
              size='small'
              onChange={(e) => dispatch(setComposeKey({ type: 'AreaKey', value: e.target.value }))}
              sx={{
                "& .MuiSelect-iconOutlined": { display: composeSetting.AreaKey.length !== 0 ? 'none' : '' },
                "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' }
              }}
              endAdornment={
                <IconButton
                  size='small'
                  onClick={() => dispatch(setComposeKey({ type: 'AreaKey', value: [] }))}
                  sx={{ visibility: composeSetting.AreaKey.length !== 0 ? "visible" : "hidden" }}
                >
                  <Close />
                </IconButton>
              }
            >
              {yKey.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </Stack>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default React.memo(ComposeStyleSetting)
