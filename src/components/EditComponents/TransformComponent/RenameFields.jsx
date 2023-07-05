import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import RenameColumn from "./RenameFieldsDetail/RenameColumn";
import { StyledFieldsLabel } from "./RenameFieldsDetail/RenameFieldsUI/StyledFieldsLabel";
import { StyledRenameFieldsBox } from "./RenameFieldsDetail/RenameFieldsUI/StyledRenameFieldsBox";
import TransformAccordion from "./TransformAccordion/TransformAccordion";

const RenameFields = ({ panelID, transformIndex, name }) => {
  const { allColumnInfo } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    return {
      allColumnInfo: targetPanel[0]?.transform_dataColumns,
    };
  });
  return (
    <TransformAccordion
      panelID={panelID}
      transformIndex={transformIndex}
      functionName={name}
    >
      <StyledRenameFieldsBox>
        {allColumnInfo[transformIndex].map((columnInfo) => {
          return columnInfo.columns.map((col) => (
            <Box key={col} display="flex" alignItems="center">
              {/* <StyledFieldsLabel>
                {columnInfo.dataLabel}.{cols}
              </StyledFieldsLabel> */}
              <RenameColumn
                panelID={panelID}
                transformIndex={transformIndex}
                tabelLabel={columnInfo.dataLabel}
                tableId={columnInfo.dataName}
                columnName={col}
                allColumns={columnInfo.columns}
              />
            </Box>
          ));
        })}
      </StyledRenameFieldsBox>
    </TransformAccordion>
  );
};

export default RenameFields;
