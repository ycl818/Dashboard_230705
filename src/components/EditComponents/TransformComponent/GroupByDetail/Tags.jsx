import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ListItem, ListItemText } from "@mui/material";
import { StyledTagBox } from "./GroupByUI/StyleTagBox";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTransformRules } from "../../../../store";
import { useEffect } from "react";

const Tags = ({panelID, transformIndex, tableId, columnName, groupbyOption }) => {
  const functionalities = [
    { title: "Min", function: 'min' },
    { title: "Max", function: 'max' },
    { title: "Mean", function: 'mean' },
    { title: "Total", function: 'sum' },
    { title: "Count", function: 'count' },
  ];

  const selectIdx = groupbyOption.findIndex((option) => option.target_table === tableId)
  const [inputValue, setInputValue] = useState(
    selectIdx === -1 ? []
    : Object.keys(groupbyOption[selectIdx].calculate).includes(columnName)
      ? functionalities.filter((func) => groupbyOption[selectIdx].calculate[columnName].includes(func.function)) : []
  );
  const dispatch = useDispatch()

  useEffect(() => {
    if (groupbyOption.length === 0) setInputValue([])
  }, [groupbyOption])

  const getUpdateOptions = (selected) => {
    let current_option = JSON.parse(JSON.stringify(groupbyOption))
    let selectIdx = current_option.findIndex((option) => option.target_table === tableId)

    if (selectIdx === -1) {
      return [
        ...current_option,
        {
          target_table: tableId,
          groupby: [],
          calculate: { [columnName]: selected }
        }
      ]
    } else if (selected.length > 0) {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        calculate: {
          ...current_option[selectIdx].calculate,
          [columnName]: selected
        }
      }
    } else {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        calculate: Object.fromEntries(
          Object.entries(current_option[selectIdx].calculate).filter(([col]) => col !== columnName)
        )
      }

      if (current_option[selectIdx].groupby.length === 0 && Object.keys(current_option[selectIdx].calculate).length === 0) {
        current_option.splice(selectIdx, 1)
      }
      return current_option
    }
    return current_option
  }

  return (
    <>
      <StyledTagBox>
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={(event, newValue) => {
            setInputValue(newValue);
            const updated_option = getUpdateOptions(newValue.map((v) => v.function))
            dispatch(updateTransformRules({
              panelID,
              transformIndex,
              rule: {id: 'groupby', options: updated_option}
            }))
          }}
          options={functionalities}
          value={inputValue}
          freeSolo
          getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "10px ",
                },
                "& .MuiChip-label ": {
                  p: "0 8px",
                },
              }}
              {...params}
              placeholder="Select Stats"
            />
          )}
        />
      </StyledTagBox>
    </>
  );
}

export default React.memo(Tags)
