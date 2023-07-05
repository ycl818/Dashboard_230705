import { Refresh } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DropdownTitle from "./DropdownTitle";
import GraphTypeSwitcher from "./GraphTypeSwitcher";

const WidgetLayout = ({ widget, keysArray }) => {
  const [refreshKey, setRefreshKey] = useState(true);
  const dataKey =
    widget.chart_option.y_key.length !== 0
      ? widget.chart_option.y_key
      : keysArray.length === 0
      ? []
      : keysArray.length === 1
      ? [keysArray[0]]
      : keysArray.slice(1);

  const XaxisName =
    widget.chart_option.x_key !== ""
      ? widget.chart_option.x_key
      : keysArray.length === 0
      ? ""
      : keysArray[0];
  return (
    <>
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
        {widget.data[0]?.datasource ? (
          <Tooltip title="Refresh">
            <IconButton
              sx={{ position: "absolute", right: "0" }}
              onClick={() => {
                setRefreshKey((prev) => !prev);
              }}
              size="small"
            >
              <Refresh color="primary" fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
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
              key={refreshKey}
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
        </>
      )}
    </>
  );
};

export default WidgetLayout;
