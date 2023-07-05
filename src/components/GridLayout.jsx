import React, { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Link } from "react-router-dom";
import DropdownTitle from "../components/DropdownTitle";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import GraphTypeSwitcher from "./GraphTypeSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { modifyLayouts } from "../store";
import { Refresh } from "@mui/icons-material";
import WidgetLayout from "./WidgetLayout";

const GridLayout = () => {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const dispatch = useDispatch();
  // const isFetchErrorArray = useSelector((state) =>
  //   state.widget.widgetArray.map((panel) => panel.fetchError)
  // );
  // console.log(
  //   "file: GridLayout.jsx:23 ~ GridLayout ~ isFetchErrorArray:",
  //   isFetchErrorArray
  // );
  const widgetA = useSelector((state) => state.widget.widgetArray);
  //console.log("file: GridLayout.jsx:27 ~ GridLayout ~ widgetA:", widgetA);
  //const layouts = useSelector((state) => state.widget.widgetArray);
  //console.log(widgetA);
  //console.log(widgetA[0].data.dataDetail);
  //const saveLayout = localStorage.getItem("grid-layout");
  //const layoutSave = saveLayout ? JSON.parse(saveLayout) : widgetA;
  const layoutSave = useMemo(() => widgetA, [widgetA]);
  //console.log("layoutSave: ", layoutSave);

  const [layout, setLayout] = useState(layoutSave);
  const [refreshKeys, setRefreshKeys] = useState(widgetA.map(() => true));

  const handleModify = (newLayout) => {
    //console.log("layouts: ~~", newLayout);

    if (layout !== newLayout) {
      setLayout(newLayout);
      dispatch(modifyLayouts({ layouts: newLayout }));
    }
  };

  // const handleDelete = (key) => {
  //   dispatch(deleteWidget(key));
  // };

  return (
    <Box sx={{ height: "100%" }}>
      {/* <button className="btn primary" >Add Widget</button> */}
      {/* <Button variant="contained" onClick={() => handleAdd()}>
        Add Widget
      </Button> */}

      <ResponsiveReactGridLayout
        style={{ display: "flex" }}
        onLayoutChange={handleModify}
        //verticalCompact={true}
        layout={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
        autoSize={true}
        margin={{
          lg: [20, 20],
          md: [20, 20],
          sm: [20, 20],
          xs: [20, 20],
          xxs: [20, 20],
        }}
        isDraggable
        isRearrangeable
        isResizable
        draggableHandle=".dropdown__title"
      >
        {widgetA?.map((widget, index) => {
          const hasFetchError = widget.data.some(
            (element) => element.fetchError === true
          );

          let keysArray = [];
          // 這邊暫時預設data[0] 之後可能會改成selected query
          if (widget.chart_data.length > 0) {
            if (
              widget.chart_data[0]?.dataTable &&
              widget.chart_data[0]?.dataTable.length > 0
            ) {
              keysArray = Object.keys(widget.chart_data[0].dataTable[0]);
            }
          }

          return (
            <Box
              component="div"
              className={
                hasFetchError ? "isFetchError reactGridItem" : "reactGridItem"
              }
              key={widget.i}
              data-grid={{
                x: widget?.x,
                y: widget?.y,
                w: widget?.w,
                h: widget?.h,
                i: widget.i,
                minW: 1,
                maxW: Infinity,
                minH: 1,
                maxH: Infinity,
                isDraggable: true,
                isResizable: true,
              }}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <WidgetLayout widget={widget} keysArray={keysArray} />
            </Box>
          );
        })}
      </ResponsiveReactGridLayout>
    </Box>
  );
};

export default GridLayout;
