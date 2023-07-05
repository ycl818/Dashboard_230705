import { Box } from "@mui/material";
//import { useEffect } from "react";
import GridLayout from "../components/GridLayout";
import VariablesBlock from "../components/VariablesBlock";
import { useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import ConnectSocket from "../components/ConnectSocket";
import QueryStaticURL from "../components/QueryStaticURL";

// import { useDispatch } from "react-redux";
// import {
//   fetchExistDashboard,
//   fetchExistDashboardVariable,
//   useFetchWidgetDataQuery,
// } from "../store";

const Dashboard = () => {
  // const dispatch = useDispatch();
  // const { data } = useFetchWidgetDataQuery();
  // console.log(data);
  // const panelArray = data?.widget?.widgetArray;
  // const variableArray = data?.variable?.variableArray;

  // useEffect(() => {
  //   data &&
  //     dispatch(fetchExistDashboard({ panelArray })) &&
  //     dispatch(fetchExistDashboardVariable({ variableArray }));
  // }, [data, panelArray, variableArray, dispatch]);

  const show = useSelector((state) => {
    return state.widget.widgetArray.filter(
      (panel) => panel.data.datasource_url === null
    );
  });

  let variablesArray = useSelector((state) => {
    return state.variable.variableArray;
  });

  // connect all ws url
  const { allWebSocketURL } = useSelector((state) => {
    const targetPanels = state.widget.widgetArray.filter(
      (panel) => panel.typeOfData === "Streaming"
    );
    const targetURLs = targetPanels?.map((panel) => {
      const urls = panel.data.map((singleData) => {
        if (
          singleData?.datasource_url?.split(":")[0] === "ws" ||
          singleData?.datasource_url?.split(":")[0] === "wss"
        )
          return {
            datasource_url: singleData.datasource_url,
            dataName: singleData.dataName,
            panelID: panel.i,
          };
      });
      return urls;
    });
    return {
      allWebSocketURL: targetURLs,
    };
  });
  //console.log("🚀 ~ file: Dashboard.jsx:58 ~ const{allWebSocketURL}=useSelector ~ allWebSocketURL:", allWebSocketURL)

  const { allStaticURL } = useSelector((state) => {
    const targetPanels = state.widget.widgetArray.filter(
      (panel) => panel.typeOfData === "Static"
    );
    const targetPanelsData = targetPanels.map((panel) => {
      const panelInterval = panel.staticQueryInterval;
      const panelID = panel.i;
      return panel.data.map((data) => {
        return {
          datasource_url: data.datasource_url,
          panelInterval,
          dataName: data.dataName,
          panelID,
        };
      });
    });

    return {
      allStaticURL: targetPanelsData,
    };
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
    <Box height="100%">
      {allWebSocketURL?.map((websocketURL) => {
        console.log("ws urls: ~", websocketURL);
        if (websocketURL[0]) {
          return (
            <ConnectSocket
              key={websocketURL[0].dataName}
              datasource_url={websocketURL[0].datasource_url}
              dataName={websocketURL[0].dataName}
              panelID={websocketURL[0].panelID}
              connectWS={connectWS}
              variablesArray={variablesArray}
            />
          );
        }
      })}

      {allStaticURL?.flat(1).map((staticURL) => {
        return (
          <QueryStaticURL
            key={staticURL.dataName}
            datasource_url={staticURL.datasource_url}
            panelInterval={staticURL.panelInterval}
            dataName={staticURL.dataName}
            panelID={staticURL.panelID}
            variablesArray={variablesArray}
          />
        );
      })}

      {show.length ? "" : <VariablesBlock />}
      <GridLayout />
    </Box>
  );
};

export default Dashboard;
