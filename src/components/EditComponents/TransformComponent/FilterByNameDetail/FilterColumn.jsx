import React from "react";

import FilterColumnKey from "./FilterColumnKey";

const FilterColumn = ({ panelID, transformIndex, tableId, tableName, tableKeys }) => {
  return (
    <>
      {tableKeys.map((key, idx) => {
        const keyName = key;
        return (
          <FilterColumnKey
            panelID={panelID}
            transformIndex={transformIndex}
            keyName={keyName}
            tableId={tableId}
            tableName={tableName}
          />
        );
      })}
    </>
  );
};

export default React.memo(FilterColumn);
