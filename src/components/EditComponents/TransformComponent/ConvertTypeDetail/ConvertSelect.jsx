import { Add, Delete } from '@mui/icons-material'
import { Button, IconButton, MenuItem, Select, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTransformRules } from '../../../../store'
import { ConvertSelectorOutline } from './ConvertTypeUI/ConvertSelectorOutline'
import { StyledConvertTypeLabel } from './ConvertTypeUI/StyledConvertTypeLabel'

const ConvertSelect = ({ panelID, transformIndex, optionIndex, selectValue, deleteDisable }) => {
  // console.log("🚀 ~ file: ConvertSelect.jsx:11 ~ ConvertSelect ~ selectValue:", selectValue)
  const dispatch = useDispatch()
  const { allColumnInfo, convertTypeOption } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    
    return {
      allColumnInfo: targetPanel[0]?.transform_dataColumns,
      convertTypeOption: targetPanel[0]?.transform_rules[transformIndex].options
    };
  })
  const all_type = {
    string: 'String',
    int32: 'Integer',
    float32: 'Float',
    boolean: 'Boolean'
  }

  const [selectedColumn, setSelectedColumn] = useState(selectValue.column)
  const [selectedType, setSelectedType] = useState(selectValue.type)
  // console.log("🚀 ~ file: ConvertSelect.jsx:30 ~ ConvertSelect ~ selectedType:", selectedType)
  
  useEffect(() => {
    setSelectedColumn(selectValue.column)
    setSelectedType(selectValue.type)
  }, [selectValue])

  // console.log(allColumnInfo[transformIndex])
  const updateOption = (selected_column, selected_type, delete_option=false) => {
    let current_option = JSON.parse(JSON.stringify(convertTypeOption))
    if (delete_option) {
      // delete oprtion
      current_option.splice(optionIndex, 1)
    } else if (optionIndex === 'new') {
      //push new option
      current_option.push(
        {
          target_table: selected_column.tableId,
          target_label: selected_column.tableLabel,
          column: selected_column.column,
          astype: selected_type
        }
      )
    } else {
      //update option by optionIndex
      current_option[optionIndex] = {
        target_table: selected_column.tableId,
        target_label: selected_column.tableLabel,
        column: selected_column.column,
        astype: selected_type
      }
    }

    console.log(current_option)

    dispatch(updateTransformRules({
      panelID,
      transformIndex,
      rule: {id: 'convertType', options: current_option}
    }))
  }

  const handleColumnChange = (event) => {
    if (selectedType !== '') {
      // dispatch column and type to redux
      updateOption(event.target.value, selectedType)
      setSelectedColumn(event.target.value)
    } else {
      setSelectedColumn(event.target.value)
    }
  }

  const handleTypeChange = (event) => {
    if (selectedColumn !== '') {
      // dispatch column and type to redux
      updateOption(selectedColumn, event.target.value)
      if (optionIndex === 'new') {
        setSelectedType('')
        setSelectedColumn('')
      } else {
        setSelectedType(event.target.value)
      }
    } else {
      setSelectedType(event.target.value)
    }
  }

  let renderColumns = allColumnInfo[transformIndex]?.map((columnInfo) => {    
    return columnInfo.columns.map((col, idx) => {
      return (
        <MenuItem value={{tableId: columnInfo.dataName, column: col, tableLabel: columnInfo.dataLabel}} key={`${col}__idx`}>
          {columnInfo.dataLabel}.{col}
        </MenuItem>
      );
    });
  });

  return (
    <>
      <Stack direction='row'>
        <StyledConvertTypeLabel>Field</StyledConvertTypeLabel>
        <ConvertSelectorOutline>
          <Select
            value={selectedColumn}
            renderValue={(value) => value === "" ? 'Select Field' : `${value.tableLabel}.${value.column}`}
            displayEmpty
            onChange={handleColumnChange}
          >
            {renderColumns}
          </Select>
        </ConvertSelectorOutline>
        <StyledConvertTypeLabel>as</StyledConvertTypeLabel>
        <ConvertSelectorOutline>
          <Select
            value={selectedType}
            renderValue={(value) => value === "" ? 'Select Type' : all_type[value]}
            displayEmpty
            onChange={handleTypeChange}
          >
            {Object.entries(all_type).map(([value, title]) => (
              <MenuItem value={value} key={value}>{title}</MenuItem>
            ))}
            {/* {all_type.map((type) => (
              <MenuItem value={type} key={type.value}>{type.title}</MenuItem>
            ))} */}
          </Select>
        </ConvertSelectorOutline>
        <IconButton
          sx={{
            m: 0.5,
            height: "33px",
          }}
          variant="contained"
          color='secondary'
          disabled={deleteDisable}
          onClick={() => {
            updateOption(null, null, true)
            // state.widgetArray[panelIndex].data.splice(dataPanelId, 1);
          }}
        >
          <Delete />
        </IconButton>
      </Stack>
      
      {/* <Button
        onClick={() => {

        }}
        sx={{ textTransform: "none" }}
        size='small'
        variant='outlined'
      >
        <Add />Convert field type
      </Button> */}
    </>
  )
}

export default React.memo(ConvertSelect)
