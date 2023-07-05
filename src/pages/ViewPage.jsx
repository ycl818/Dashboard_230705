import { Box, Button, Tooltip } from "@mui/material";
import GraphTypeSwitcher from "../components/GraphTypeSwitcher";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Refresh } from "@mui/icons-material";
import ViewPageConnectSocket from "../components/ViewPageConnectSocket";
import { useCallback } from "react";

const ViewPage = () => {
  const locationPath = window.location.href;
  const panelID = locationPath.split("/")[4];

  const {
    dataTable,
    chartType,
    chartSetting,
    chartData,
    chartX,
    chartY,
    dataLimit,
  } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    return {
      // 這邊data[0]暫時預設是第0個data 之後可能會改成selected query
      dataTable: targetPanel[0]?.data[0]?.dataTable,
      chartType: targetPanel[0]?.chart_option?.chartType,
      chartSetting: targetPanel[0]?.chart_option?.setting,
      chartData: targetPanel[0]?.chart_data[0]?.dataTable, //////////[0] ??
      chartX: targetPanel[0]?.chart_option.x_key,
      chartY: targetPanel[0]?.chart_option.y_key,
      dataLimit: targetPanel[0]?.data_limit,
    };
  });

  const [refreshKey, setRefreshKey] = useState(false);

  let keys = [];
  if (chartData && chartData.length >= 1) {
    keys = Object.keys(chartData[0]);
  }

  const dataKey =
    chartY.length !== 0
      ? chartY
      : keys.length === 0
      ? []
      : keys.length === 1
      ? [keys[0]]
      : keys.slice(1);
  const XaxisName =
    chartX !== "" ? chartX : keys.length === 0 ? "no data" : keys[0];
  // else if (dataTable) {
  //   keys = Object.keys(dataTable[0]);
  // }

  // get dataDeatail
  const { dataDetails } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    const targetDetail = targetPanel[0].data.map((singlePanel) => {
      return {
        dataName: singlePanel.dataName,
        datasource_url: singlePanel.datasource_url,
      };
    });

    return {
      dataDetails: targetDetail,
    };
  });

  let variablesArray = useSelector((state) => {
    return state.variable.variableArray;
  });

  const connectWS = useCallback((variablesArray, currentText) => {
    // Define default values for each variable
    let defaultValues = {};

    variablesArray.forEach(({ variableName, defaultValue }) => {
      defaultValues[variableName] = defaultValue;
    });

    console.log("before ws regex:", currentText);

    currentText = currentText.replace(/@(\w+)/g, (match, variableName) => {
      const variableValue = defaultValues[variableName];
      return variableValue !== undefined ? variableValue : match;
    });
    console.log("after ws regex:", currentText);

    return currentText;
  }, []);

  return (
    <Box style={{ height: "calc(100vh - 48px)" }}>
      {dataDetails?.map((dataPanel) => {
        if (
          dataPanel.datasource_url.split(":")[0] === "ws" ||
          dataPanel.datasource_url.split(":")[0] === "wss"
        ) {
          return (
            <ViewPageConnectSocket
              key={dataPanel.dataName}
              panelID={panelID}
              connectWS={connectWS}
              datasource_url={dataPanel.datasource_url}
              dataName={dataPanel.dataName}
              variablesArray={variablesArray}
            />
          );
        }
      })}

      {/* <Stack direction="row" spacing={2} justifyContent="space-between"> */}
      {/* <Sidebar /> */}
      <Box sx={{ p: 2, paddingLeft: 5 }}>
        <Tooltip title="Refresh">
          <Button
            onClick={() => setRefreshKey((prev) => !prev)}
            variant="outlined"
          >
            <Refresh />
          </Button>
        </Tooltip>
      </Box>
      <Box
        sx={{
          width: "90%",
          height: "80%",
          margin: "1rem 1rem 1rem 3rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GraphTypeSwitcher
          key={refreshKey || "name"}
          type={chartType}
          data={chartData ? chartData : dataTable}
          dataKey={dataKey}
          XaxisName={XaxisName}
          // dataKey={dataTable ? keys.slice(1,) : "No Data"} // 這邊之後應該要換成chart_option的y_key
          chartSetting={chartSetting}
          dataLimit={dataLimit}
          // XaxisName={dataTable ? keys[0] : "No Data"} // 這邊之後應該要換成chart_option的y_key
        />
      </Box>
    </Box>
  );
};

export default ViewPage;
