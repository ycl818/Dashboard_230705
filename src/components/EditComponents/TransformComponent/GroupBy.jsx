import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import GroupBySelect from "./GroupByDetail/GroupBySelect";
import { StyledLabel } from "./GroupByDetail/GroupByUI/StyledLabel";
import { StyledBox } from "./GroupByDetail/GroupByUI/StyledBox";
import TransformAccordion from "./TransformAccordion/TransformAccordion";

const GroupBy = ({ panelID, transformIndex, name }) => {
  const { allColumnInfo } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    
    return {
      allColumnInfo: targetPanel[0]?.transform_dataColumns
    };
  });


  let renderColumns = allColumnInfo[transformIndex].map((columnInfo) => {
    return columnInfo.columns.map((cols) => {
      return (
        <Box key={cols} display="flex" alignItems="center">
          <StyledLabel>
            {columnInfo.dataLabel}.{cols}
          </StyledLabel>
          <GroupBySelect
            panelID={panelID}
            transformIndex={transformIndex}
            tableId={columnInfo.dataName}
            columnName={cols}
          />
        </Box>
      );
    });
  });

  return (
    <TransformAccordion panelID={panelID} transformIndex={transformIndex} functionName={name}>
      <StyledBox>{renderColumns}</StyledBox>
    </TransformAccordion>
  );
};
export default React.memo(GroupBy);
