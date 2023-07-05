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
import Refreshbtn from "./Refreshbtn";

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
  // const [refreshKeys, setRefreshKeys] = useState(widgetA.map(() => true));

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
          console.log("hhiiiiiiiiiiiiiiiiiiiiiiiiii");
          const hasFetchError = widget.data.some(
            (element) => element.fetchError === true
          );

          let keysArry = [];
          // 這邊暫時預設data[0] 之後可能會改成selected query
          if (widget.chart_data.length > 0) {
            if (
              widget.chart_data[0]?.dataTable &&
              widget.chart_data[0]?.dataTable.length > 0
            ) {
              keysArry = Object.keys(widget.chart_data[0].dataTable[0]);
            }
          }

          const dataKey =
            widget.chart_option.y_key.length !== 0
              ? widget.chart_option.y_key
              : keysArry.length === 0
              ? []
              : keysArry.length === 1
              ? [keysArry[0]]
              : keysArry.slice(1);

          const XaxisName =
            widget.chart_option.x_key !== ""
              ? widget.chart_option.x_key
              : keysArry.length === 0
              ? ""
              : keysArry[0];

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
              <div
                className="dropdown__title"
                style={{
                  width: "100%",
                  height: "44px",
                  display: "flex",
                  flexDirection: "row",
                  // textAlign: "center",
                  position: "relative",
                }}
              >
                <Box style={{ flex: "50%" }}>
                  <DropdownTitle
                    panelID={widget.i}
                    title={widget.panelName || "New Title"}
                  />
                </Box>

                <Refreshbtn index={index} />
              </div>

              {widget.data[0]?.datasource ? ( //////////////data[0] 不確定是否永遠data[0]
                <>
                  <Box
                    component="div"
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <GraphTypeSwitcher
                      // key={refreshKeys[index]}
                      type={widget.chart_option.chartType}
                      data={
                        widget.chart_data.length > 0
                          ? widget.chart_data[0].dataTable
                          : []
                      } ///// 這邊data[0]暫時預設是第0個data 之後可能會改成selected query
                      XaxisName={XaxisName}
                      dataKey={dataKey}
                      chartSetting={widget.chart_option.setting}
                      dataLimit={widget.data_limit}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to={`/${widget.i}/edit`}
                    sx={{ width: "100%", height: "82%" }}
                    className="addPanelbtn"
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <Typography variant="h5" sx={{ marginTop: "1rem" }}>
                      Add a new panel
                    </Typography>
                  </Button>
                  {/* <button
                    className="deleteButton"
                    onClick={() => handleDelete(widget.i)}
                  >
                    x
                  </button> */}
                </>
              )}

              {/* <div>{widget.i}</div> */}
            </Box>
          );
        })}
      </ResponsiveReactGridLayout>
    </Box>
  );
};

export default GridLayout;
