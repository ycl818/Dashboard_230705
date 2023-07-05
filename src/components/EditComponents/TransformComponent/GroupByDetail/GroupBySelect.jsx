import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import Tags from "./Tags";
import { StyledSelectBox } from "./GroupByUI/StyledSelectBox";
import { useDispatch, useSelector } from "react-redux";
import { updateTransformRules } from "../../../../store";
import { useEffect } from "react";

const GroupBySelect = ({ panelID, transformIndex, tableId, columnName }) => {
  const dispatch = useDispatch();
  const { groupbyOption } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    return {
      groupbyOption: targetPanel[0]?.transform_rules[transformIndex].options,
    };
  });

  const selector = ["Group by", "Calculate"];
  const selectIdx = groupbyOption.findIndex(
    (option) => option.target_table === tableId
  );
  const [selectValue, setSelectValue] = useState(
    selectIdx === -1
      ? ""
      : groupbyOption[selectIdx].groupby.includes(columnName)
      ? "Group by"
      : Object.keys(groupbyOption[selectIdx].calculate).includes(columnName)
      ? "Calculate"
      : ""
  );

  useEffect(() => {
    if (groupbyOption.length === 0) setSelectValue("");
  }, [groupbyOption]);

  const getUpdateOptions = (selected) => {
    let current_option = JSON.parse(JSON.stringify(groupbyOption));

    if (selectIdx === -1) {
      if (selected === "Group by") {
        current_option.push({
          target_table: tableId,
          groupby: [columnName],
          calculate: {},
        });
        // return [
        //   ...current_option,
        //   {
        //     target_table: tableId,
        //     groupby: [columnName],
        //     calculate: {}
        //   }
        // ]
      }
      return current_option;
    } else if (selected === "") {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        groupby: current_option[selectIdx].groupby.filter(
          (col) => col !== columnName
        ),
      };
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        calculate: Object.fromEntries(
          Object.entries(current_option[selectIdx].calculate).filter(
            ([col]) => col !== columnName
          )
        ),
      };
      if (
        current_option[selectIdx].groupby.length === 0 &&
        Object.keys(current_option[selectIdx].calculate).length === 0
      ) {
        current_option.splice(selectIdx, 1);
      }
      return current_option;
    } else if (selected === "Group by") {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        calculate: Object.fromEntries(
          Object.entries(current_option[selectIdx].calculate).filter(
            ([col]) => col !== columnName
          )
        ),
      };
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        groupby: [...current_option[selectIdx].groupby, columnName],
      };
      return current_option;
    } else if (selected === "Calculate") {
      current_option[selectIdx] = {
        ...current_option[selectIdx],
        groupby: current_option[selectIdx].groupby.filter(
          (col) => col !== columnName
        ),
      };
      return current_option;
    }
    return current_option;
  };

  return (
    <>
      <StyledSelectBox>
        <Autocomplete
          id="combo-box-demo"
          options={selector}
          value={selectValue}
          onChange={(event) => {
            setSelectValue(event.target.textContent);
            const updated_option = getUpdateOptions(event.target.textContent);
            dispatch(
              updateTransformRules({
                panelID,
                transformIndex,
                rule: { id: "groupby", options: updated_option },
              })
            );
          }}
          sx={{ width: 192 }}
          displayempty
          renderInput={(params) => (
            <TextField {...params} placeholder="Ignored" />
          )}
        />
        {selectValue === "Calculate" && (
          <Tags
            panelID={panelID}
            transformIndex={transformIndex}
            tableId={tableId}
            columnName={columnName}
            groupbyOption={groupbyOption}
          />
        )}
      </StyledSelectBox>
    </>
  );
};

export default React.memo(GroupBySelect);
