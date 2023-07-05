import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchErrorShowBorder, updateData } from "../store";
import { useDispatch, useSelector } from "react-redux";

const ConnectSocket = ({
  datasource_url,
  dataName,
  panelID,
  connectWS,
  variablesArray,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

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
      const handleOpen = () => {
        console.log(
          `[open connection homepage]: url ${datasource_url}, dataName:  ${dataName} `
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

      const handleMessage = (e) => {
        let data = e.data;
        data = JSON.parse(data);
        console.log("websocket message in homepage:~~~", data);
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

      const handleClose = () => {
        console.log(
          `[close connection homepage]: url ${datasource_url}, dataName:  ${dataName} `
        );
      };

      const handleError = (e) => {
        console.log(e);
        // clear websocket data
        setWebsocketData([]);

        const res = true;
        const id = panelID;
        const message = "There was an error with your websocket!";
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

      ws.addEventListener("open", handleOpen);
      ws.addEventListener("message", handleMessage);
      ws.addEventListener("close", handleClose);
      ws.addEventListener("error", handleError);

      return () => {
        ws.removeEventListener("open", handleOpen);
        ws.removeEventListener("message", handleMessage);
        ws.removeEventListener("close", handleClose);
        ws.removeEventListener("error", handleError);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [variablesArray, datasource_url, location.pathname]);

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

export default React.memo(ConnectSocket);
