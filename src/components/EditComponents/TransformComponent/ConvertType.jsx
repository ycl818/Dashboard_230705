import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ConvertSelect from "./ConvertTypeDetail/ConvertSelect";
import { StyledConvertTypeBox } from "./ConvertTypeDetail/ConvertTypeUI/StyledConvertTypeBox";
import TransformAccordion from "./TransformAccordion/TransformAccordion";

const ConvertType = ({ panelID, transformIndex, name }) => {
  const { convertTypeOption } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    return {
      convertTypeOption:
        targetPanel[0]?.transform_rules[transformIndex].options,
    };
  });

  return (
    <TransformAccordion
      panelID={panelID}
      transformIndex={transformIndex}
      functionName={name}
    >
      <StyledConvertTypeBox>
        {convertTypeOption.map((option, index) => {
          const select_value = {
            column: {
              tableId: option.target_table,
              tableLabel: option.target_label,
              column: option.column,
            },
            type: option.astype,
          };
          return (
            <ConvertSelect
              key={index}
              panelID={panelID}
              transformIndex={transformIndex}
              optionIndex={index}
              selectValue={select_value}
              deleteDisable={false}
            />
          );
        })}
        <ConvertSelect
          panelID={panelID}
          transformIndex={transformIndex}
          optionIndex="new"
          selectValue={{ column: "", type: "" }}
          deleteDisable={true}
        />
        {/* <Button sx={{ textTransform: "none" }} size='small' variant='outlined'><Add/>Convert field type</Button> */}
      </StyledConvertTypeBox>
    </TransformAccordion>
  );
};

export default React.memo(ConvertType);
