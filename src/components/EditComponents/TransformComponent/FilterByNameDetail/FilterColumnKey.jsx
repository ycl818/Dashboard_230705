import React from "react";
import { StyledFilterByNameBox } from "./FIlterByNameUI/StyledFilterByNameBox";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTransformRules } from "../../../../store";
import { useEffect } from "react";

const FilterColumnKey = ({ panelID, transformIndex, keyName, tableId, tableName }) => {
  const dispatch = useDispatch()
  const { filterColumnOption } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    return {
      filterColumnOption: targetPanel[0]?.transform_rules[transformIndex].options,
    };
  });
  const selectIdx = filterColumnOption.findIndex((option) => option.target_table === tableId)

  const [click, setClick] = useState(
    selectIdx === -1 ? true
      : filterColumnOption[selectIdx].filter_columns.includes(keyName)
        ? false : true
  );
  
  const getUpdateOptions = (check) => {
    let current_option = JSON.parse(JSON.stringify(filterColumnOption))
    if (selectIdx === -1) {
      if (!check) {
        current_option.push(
          {
            target_table: tableId,
            filter_columns: [keyName]
          }
        )
      }
    } else if (check) {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        filter_columns: current_option[selectIdx].filter_columns.filter((col) => col !== keyName)
      }
    } else {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        filter_columns: [...current_option[selectIdx].filter_columns, keyName]
      }
    }
    current_option = current_option.filter((option) => option.filter_columns.length > 0)
    return current_option
  }

  // useEffect(() => {
  //   const updated_option = getUpdateOptions()
  //   dispatch(updateTransformRules({
  //     panelID,
  //     transformIndex,
  //     rule: {id: 'filterByName', options: updated_option}
  //   }))
  // }, [click])

  useEffect(() => {
    if (filterColumnOption.length === 0) setClick(true)
  }, [filterColumnOption])

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => {
        // console.log('clickkkk', click)
        const updated_option = getUpdateOptions(!click)
        dispatch(updateTransformRules({
          panelID,
          transformIndex,
          rule: {id: 'filterByName', options: updated_option}
        }))
        setClick((prev) => !prev);
      }}
    >
      <StyledFilterByNameBox>
        <Typography sx={{ color: !click ? "#909396" : "" }}>
          {tableName}.{keyName}
          {click && <CheckIcon sx={{ fontSize: "1rem" }} />}
        </Typography>
      </StyledFilterByNameBox>
    </Box>
  );
};

export default React.memo(FilterColumnKey);
