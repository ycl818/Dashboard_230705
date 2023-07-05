import React from "react";
import TransformAccordion from "./TransformAccordion/TransformAccordion";
import { StyledSortByLabel } from "./SortByDetail/SortByUI/StyledSortByLabel";
import SortBySelect from "./SortByDetail/SortBySelect";
import StyleSortByBox from "./SortByDetail/SortByUI/StyleSortByBox";
import { useSelector } from "react-redux";

const SortBy = ({ panelID, transformIndex, name }) => {
  return (
    <TransformAccordion
      panelID={panelID}
      transformIndex={transformIndex}
      functionName={name}
    >
      <StyleSortByBox>
        <StyledSortByLabel>Field</StyledSortByLabel>
        <SortBySelect
          panelID={panelID}
          transformIndex={transformIndex}
        ></SortBySelect>
      </StyleSortByBox>
    </TransformAccordion>
  );
};

export default React.memo(SortBy);
