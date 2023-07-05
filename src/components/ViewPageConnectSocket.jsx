import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchErrorShowBorder, updateData } from "../store";

const ViewPageConnectSocket = ({
  connectWS,
  datasource_url,
  variablesArray,
  dataName,
}) => {
  const locationPath = window.location.href;
  const panelID = locationPath.split("/")[4];

  const { dataDetail, streamingOption } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    return {
      dataDetail: targetPanel[0].data
        .filter((data) => data.dataName === dataName)
        .map((data) => data.dataDetail),
      streamingOption: targetPanel[0].streamingOption,
    };
  });

  const [websocketData, setWebsocketData] = useState(dataDetail.flat(1));

  const dispatch = useDispatch();

  useEffect(() => {
    if (datasource_url) {
      let wsURL = connectWS(variablesArray, datasource_url);
      let ws = new WebSocket(wsURL);
      if (!ws) {
        for (let i = 0; i < 10; i++) {
          ws = new WebSocket(wsURL);
          if (ws) {
            break;
          }
        }
      }
      ws.onopen = () => {
        console.log(
          `[ViewPage open connection]: url ${datasource_url}, dataName:  ${dataName} `
        );
        const res = false;
        const id = panelID;
        const message = "";
        dispatch(
          fetchErrorShowBorder({
            id,
            res,
            message,
            dataPanelID: dataName,
          })
        );
      };

      ws.onmessage = (e) => {
        let data = e.data;
        data = JSON.parse(data);
        console.log("websocket message in viewpage:~~~", data);
        if (data !== undefined || data !== null) {
          if (streamingOption === "Collect") {
            setWebsocketData((prevData) => {
              return [...prevData, data];
            });
          } else {
            if (!Array.isArray(data)) {
              setWebsocketData([data]);
            } else {
              setWebsocketData(data);
            }
            // setWebsocketData(data);
          }
        }
      };

      ws.onclose = () => {
        console.log(
          `[View close connection]: url ${datasource_url}, dataName:  ${dataName} `
        );
      };
      ws.onerror = (e) => {
        console.log(e);
        // clear websocket data
        setWebsocketData([]);

        const res = true;
        const id = panelID;
        const message = "There was an error with your websocket !";
        dispatch(
          fetchErrorShowBorder({
            id,
            res,
            message,
            dataPanelID: dataName,
          })
        );
        // clear dataDetail
        dispatch(
          updateData({
            data: [],
            panelID,
            dataPanelID: dataName,
          })
        );
      };

      return () => {
        if (ws) ws.close();
      };
    }
  }, [variablesArray]);

  useEffect(() => {
    if (websocketData !== null) {
      dispatch(
        updateData({
          data: websocketData,
          panelID,
          dataPanelID: dataName,
        })
      );
    }
  }, [websocketData]);
  return <></>;
};

export default React.memo(ViewPageConnectSocket);
