import React from "react";
import { useSelector } from "react-redux";
import FilterColumn from "./FilterByNameDetail/FilterColumn";
import TransformAccordion from "./TransformAccordion/TransformAccordion";

const FilterByName = ({ panelID, transformIndex, name }) => {
  const { allColumnInfo } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    
    return {
      allColumnInfo: targetPanel[0]?.transform_dataColumns
    };
  });

  let renderFilterColumns = allColumnInfo[transformIndex].map((columnInfo, index) => {
    return (
      <FilterColumn
        panelID={panelID}
        transformIndex={transformIndex}
        tableId={columnInfo.dataName}
        tableName={columnInfo.dataLabel}
        tableKeys={columnInfo.columns}
        key={`table__${index}`}
      />
    );
  });

  return (
    <TransformAccordion
      panelID={panelID}
      transformIndex={transformIndex}
      functionName={name}
    >
      {renderFilterColumns}
    </TransformAccordion>
  );
};

export default React.memo(FilterByName);
