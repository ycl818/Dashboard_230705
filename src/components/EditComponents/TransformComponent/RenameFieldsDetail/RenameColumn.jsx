import { Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTransformRules } from "../../../../store";
import { StyledFieldsLabel } from "./RenameFieldsUI/StyledFieldsLabel";

const RenameColumn = ({
  panelID,
  transformIndex,
  tabelLabel,
  tableId,
  columnName,
  allColumns,
}) => {
  const dispatch = useDispatch();
  const { renameOption, optionIdx } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    const renameOption =
      targetPanel[0]?.transform_rules[transformIndex].options;
    const optionIdx = renameOption.findIndex(
      (option) => option.target_table === tableId
    );

    return {
      renameOption: renameOption,
      optionIdx: optionIdx,
    };
  });

  const [renameValue, setRenameValue] = useState(
    optionIdx === -1
      ? ""
      : Object.keys(renameOption[optionIdx].rename_columns).includes(columnName)
      ? renameOption[optionIdx].rename_columns[columnName].slice(0, -1)
      : ""
  );
  const [existName, setExistName] = useState(false);

  const checkNameExist = (curr_name) => {
    // check if current key or changed key includes renameValue
    let allOtherColumns = allColumns
      .filter((col) => col !== columnName)
      .map((col) => renameOption[optionIdx]?.rename_columns[col] || col);

    return allOtherColumns.includes(curr_name + " ");
  };

  useEffect(() => {
    if (renameValue !== "") {
      setExistName(checkNameExist(renameValue));
    }
  }, [renameOption]);

  const getUpdateOptions = () => {
    let current_option = JSON.parse(JSON.stringify(renameOption));

    if (
      renameValue === "" &&
      optionIdx !== -1 &&
      Object.keys(current_option[optionIdx]?.rename_columns).includes(
        columnName
      )
    ) {
      // 把{columnName}從current_option[optionIdx].rename_columns 去除
      delete current_option[optionIdx].rename_columns[columnName];
      if (Object.keys(current_option[optionIdx].rename_columns).length === 0) {
        current_option.splice(optionIdx, 1);
      }
    } else if (renameValue !== "") {
      if (optionIdx === -1) {
        current_option.push({
          target_table: tableId,
          rename_columns: { [columnName]: renameValue + " " },
        });
      } else {
        // if (!existName) {
        //   current_option[optionIdx].rename_columns = {
        //     ...current_option[optionIdx].rename_columns,
        //     [columnName]: renameValue + " ",
        //   };
        // }
        current_option[optionIdx].rename_columns = {
          ...current_option[optionIdx].rename_columns,
          [columnName]: renameValue + " ",
        };
      }
    }

    return current_option;
  };

  return (
    <Stack direction="row" alignItems="left">
      <StyledFieldsLabel>
        {tabelLabel}.{columnName}
      </StyledFieldsLabel>
      <TextField
        size="small"
        placeholder={`Rename ${columnName}`}
        error={existName}
        value={renameValue}
        onChange={(e) => {
          setRenameValue(e.target.value);
          setExistName(checkNameExist(e.target.value));
        }}
        onBlur={() => {
          const updated_option = getUpdateOptions();
          dispatch(
            updateTransformRules({
              panelID,
              transformIndex,
              rule: { id: "renameFields", options: updated_option },
            })
          );
        }}
      />
    </Stack>
  );
};

export default RenameColumn;
