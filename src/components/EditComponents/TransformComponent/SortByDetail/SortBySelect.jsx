import { MenuItem, Select, Switch } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTransformRules } from "../../../../store";
import { SelectorOutline } from "./SortByUI/SelectorOutline";
import { StyledSortByLabel } from "./SortByUI/StyledSortByLabel";

const SortBySelect = ({ panelID, transformIndex }) => {
  const dispatch = useDispatch()
  const { allColumnInfo, sortByOption } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    return {
      allColumnInfo: targetPanel[0]?.transform_dataColumns,
      sortByOption: targetPanel[0]?.transform_rules[transformIndex].options
    };
  });
  
  
  const [column, setColumn] = React.useState(
    sortByOption.length === 0 ? ""
      : {
        tableId: sortByOption[0].target_table,
        column: sortByOption[0].sort_column,
        tableLabel: sortByOption[0].target_label,
      }
  );
  const [reverseChecked, setReverseChecked] = React.useState(
    sortByOption.length === 0 ? false
      : sortByOption[0].reverse
  );

  useEffect(() => {
    if (sortByOption.length === 0) {
      setColumn("")
    }
  }, [sortByOption])

  const getUpdateOptions = (selected, type) => {
    if (type === 'select') {
      if (selected === "") {
        return []
      } else {
        return [
          {
            target_table: selected.tableId,
            target_label: selected.tableLabel,
            sort_column: selected.column,
            reverse: reverseChecked
          }
        ]
      }
    } else if (type === 'reverse' && column !== "") {
      return [
        {
          target_table: column.tableId,
          target_label: column.tableLabel,
          sort_column: column.column,
          reverse: selected
        }
      ]
    } else {
      return []
    }
    
  }

  const handleReverseCheck = (event) => {
    setReverseChecked(event.target.checked)
    const updated_option = getUpdateOptions(event.target.checked, 'reverse')
    
    dispatch(updateTransformRules({
      panelID,
      transformIndex,
      rule: {id: 'sortby', options: updated_option}
    }))
  }
  
  const handleChange = (event) => {
    setColumn(event.target.value);
    // dispatch here
    const updated_option = getUpdateOptions(event.target.value, 'select')
    dispatch(updateTransformRules({
      panelID,
      transformIndex,
      rule: {id: 'sortby', options: updated_option}
    }))
  };

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
      <SelectorOutline>
        <Select
          value={column}
          renderValue={(value) => value === "" ? 'Select field' : `${value.tableLabel}.${value.column}`}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>Select field</em>
          </MenuItem>
          {renderColumns}
        </Select>
      </SelectorOutline>
      <StyledSortByLabel>
        Reverse <Switch checked={reverseChecked} onChange={handleReverseCheck} />
      </StyledSortByLabel>
    </>
  );
};

export default React.memo(SortBySelect);
