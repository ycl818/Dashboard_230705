import { TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDataPanel,
  fetchErrorShowBorder,
  updateData,
  updateDataSourceWithURL,
} from "../../../store";
import { useState } from "react";
import { useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { useLocation } from "react-router-dom";

const DataSourceTextField = ({
  data,
  error,
  errorMsg,
  currenturl,
  panelID,
  typeofData,
  fetchURl,
  variablesArray,
  setTextValue,
  textValue,
  datasource_url,
  connectWS,
}) => {
  // console.log("file: DataSourceTextField.jsx:28 ~ data:", data.dataDetail);
  const dispatch = useDispatch();

  const [targetDebouncePanel, setTargetDebouncePanel] = useState(data.dataName);

  const [websocketData, setWebsocketData] = useState(data.dataDetail || []);

  const { streamingOption, staticQueryIntervalFromRedux } = useSelector(
    (state) => {
      const panelArray = state.widget.widgetArray;
      const targetPanel = panelArray.filter((panel) => panel.i === panelID);
      return {
        streamingOption: targetPanel[0].streamingOption,
        staticQueryIntervalFromRedux: targetPanel[0].staticQueryInterval,
      };
    }
  );

  // switch collect or overwrite => clear dataDetail
  useEffect(() => {
    dispatch(
      updateData({
        data: [],
        panelID,
        dataPanelID: targetDebouncePanel,
      })
    );
    setWebsocketData([]);
  }, [streamingOption]);

  useEffect(() => {
    if (websocketData !== null && targetDebouncePanel !== "") {
      dispatch(
        updateData({
          data: websocketData,
          panelID,
          dataPanelID: targetDebouncePanel,
        })
      );
    }
  }, [websocketData]);

  // debounce part
  const [debounceURl, setDebounceURL] = useState(datasource_url || "");

  useEffect(() => {
    if (currenturl) {
      setDebounceURL(currenturl);
    }
  }, [currenturl]);

  const detect = useDebounce(debounceURl, 1000);

  useEffect(() => {
    let ws;
    let intervalStatic;

    if (
      debounceURl.split(":")[0] === "http" ||
      debounceURl.split(":")[0] === "https"
    ) {
      try {
        if (typeofData === "Streaming") {
          setWebsocketData([]);
          // clear dataDetail
          dispatch(
            updateData({
              data: [],
              panelID,
              dataPanelID: targetDebouncePanel,
            })
          );
          throw new Error("Invalid URL: You are in the Streaming mode");
        }
        if (staticQueryIntervalFromRedux > 0) {
          intervalStatic = setInterval(() => {
            fetchURl(variablesArray, debounceURl, targetDebouncePanel);
          }, staticQueryIntervalFromRedux * 1000);
        }
        fetchURl(variablesArray, debounceURl, targetDebouncePanel);
      } catch (error) {
        const res = true;
        const id = panelID;
        dispatch(
          fetchErrorShowBorder({
            id,
            res,
            message: error.message,
            dataPanelID: targetDebouncePanel,
          })
        );
      }
    } else if (
      debounceURl.split(":")[0] === "ws" ||
      debounceURl.split(":")[0] === "wss"
    ) {
      try {
        if (typeofData === "Static") {
          setWebsocketData([]);
          // clear dataDetail
          dispatch(
            updateData({
              data: [],
              panelID,
              dataPanelID: targetDebouncePanel,
            })
          );
          throw new Error("Invalid URL: You are in the Static mode");
        }
        let wsURL = connectWS(variablesArray, debounceURl);
        console.log(
          "file: DataSourceTextField.jsx:139 ~ useEffect ~ wsURL:",
          wsURL
        );
        ws = new WebSocket(wsURL);

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
            `[EditPage open connection] dataName:${targetDebouncePanel}`
          );
          const res = false;
          const id = panelID;
          const message = "";
          dispatch(
            fetchErrorShowBorder({
              id,
              res,
              message,
              dataPanelID: targetDebouncePanel,
            })
          );
        };

        ws.onmessage = (e) => {
          let data = e.data;
          data = JSON.parse(data);
          console.log("websocket message:~~~", data);
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
          }
        };

        ws.onclose = () => {
          console.log("close connection");
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
              dataPanelID: targetDebouncePanel,
            })
          );
          // clear dataDetail
          dispatch(
            updateData({
              data: [],
              panelID,
              dataPanelID: targetDebouncePanel,
            })
          );
        };
      } catch (error) {
        const res = true;
        const id = panelID;

        dispatch(
          fetchErrorShowBorder({
            id,
            res,
            message: error.message,
            dataPanelID: targetDebouncePanel,
          })
        );
      }
    } else {
      if (debounceURl) {
        fetchURl(variablesArray, debounceURl, targetDebouncePanel);
      } else {
        // clear dataDetail
        dispatch(
          updateData({
            data: [],
            panelID,
            dataPanelID: targetDebouncePanel,
          })
        );
      }
    }

    return () => {
      if (ws && ws.readyState === 1) ws.close();
      clearInterval(intervalStatic);
    };
  }, [
    detect,
    typeofData,
    streamingOption,
    staticQueryIntervalFromRedux,
    variablesArray,
  ]);

  const TypeHandler = (e) => {
    const targetDataPanel = e.target.name;
    setTargetDebouncePanel(targetDataPanel);
    // immediately fetch here
    const targetDataPanelURL = e.target.value;
    setDebounceURL(targetDataPanelURL);
    // for showing url text
    const newState = textValue.map((text) => {
      if (text.dataName === e.target.name)
        return { ...text, datasource_url: targetDataPanelURL };
      return text;
    });
    setTextValue(newState);
    SaveLinkIntoStore(e);
  };

  const SaveLinkIntoStore = (e) => {
    // onBlur save into store
    const dataPanelID = e.target.name;
    const datasource_url = e.target.value;
    const datasourceName = "link";
    dispatch(
      updateDataSourceWithURL({
        panelID,
        dataPanelID,
        datasource_url,
        datasourceName,
      })
    );
  };

  return (
    <TextField
      key={data.dataName}
      error={error}
      sx={{ backgroundColor: "#141414" }}
      fullWidth
      hiddenLabel
      id="filled-hidden-label-small"
      name={data.dataName}
      variant="filled"
      helperText={errorMsg ? `${errorMsg}` : ""}
      size="small"
      value={currenturl || ""}
      onChange={TypeHandler}
      onBlur={SaveLinkIntoStore}
    />
  );
};

export default React.memo(DataSourceTextField);
