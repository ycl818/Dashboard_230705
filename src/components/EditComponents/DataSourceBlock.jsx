import { Box, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import {
  addDataPanel,
  fetchErrorShowBorder,
  updateData,
  updateDataSourceWithURL,
  removeDataPanel,
  updataDataPanel,
  updateDataSourceName,
} from "../../store";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import InspectDrawer from "../InspectDrawer";
import VariableAccordion from "./DataSourceComponent/VariableAccordion";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DataPanelName from "./DataSourceComponent/DataPanelName";
import ColumnSelectAccordion from "./DataSourceComponent/ColumnSelectAccordion";
import useDebounce from "../../hooks/useDebounce";
import InspectorButton from "./DataSourceComponent/DataSourceUI/InspectorButton";
import DivideLine from "./DataSourceComponent/DataSourceUI/DivideLine";
import { StyleButton } from "./DataSourceComponent/DataSourceUI/StyleButton";
import DataSourceTextField from "./DataSourceComponent/DataSourceTextField";
import { useCallback } from "react";

const DataSourceBlock = ({ panelID, typeofData }) => {
  const dispatch = useDispatch();
  const textRef = useRef("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [targetDataPanel, setTargetDataPanel] = useState("");

  const { datasource_url, fetchError, fetchErrorMessage, dataArray } =
    useSelector((state) => {
      const panelArray = state.widget.widgetArray;
      const targetPanel = panelArray.filter((panel) => panel.i === panelID);
      return {
        datasource_url: targetPanel[0]?.data.map((data) => {
          return {
            dataName: data.dataName,
            datasource_url: data.datasource_url,
          };
        }),
        fetchError: targetPanel[0]?.data.map((data) => {
          return { dataName: data.dataName, fetchError: data.fetchError };
        }),
        fetchErrorMessage: targetPanel[0]?.data.map((data) => {
          return {
            dataName: data.dataName,
            fetchErrorMessage: data.fetchErrorMessage,
          };
        }),
        dataArray: targetPanel[0]?.data,
      };
    });

  let variablesArray = useSelector((state) => {
    return state.variable.variableArray;
  });

  const [textValue, setTextValue] = useState(dataArray);

  useEffect(() => {
    setTextValue(dataArray);
  }, [addDataPanel, dataArray]);

  const fetchURl = useCallback(
    async (variablesArray, currentText, dataPanelID) => {
      try {
        // Define default values for each variable
        let defaultValues = {};

        variablesArray.forEach(({ variableName, defaultValue }) => {
          defaultValues[variableName] = defaultValue;
        });

        console.log("before regex:", currentText);

        currentText = currentText.replace(/@(\w+)/g, (match, variableName) => {
          const variableValue = defaultValues[variableName];
          return variableValue !== undefined ? variableValue : match;
        });
        console.log("after regex:", currentText);

        const response = await axios.get(currentText);

        const data = response.data;
        dispatch(updateData({ data, panelID, dataPanelID }));
        const res = false;
        const id = panelID;
        const message = "";
        dispatch(fetchErrorShowBorder({ id, res, message, dataPanelID }));
      } catch (error) {
        console.log(
          "🚀 ~ file: DataSourceBlock.jsx:100 ~ fetchURl ~ error:",
          error
        );

        const res = true;
        const id = panelID;
        const message = error.message;
        dispatch(fetchErrorShowBorder({ id, res, message, dataPanelID }));
        dispatch(updateData({ data: [], panelID, dataPanelID }));
      }
    },
    []
  );

  const connectWS = (variablesArray, currentText) => {
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
  };

  /*
  CellStatus
  ws://172.22.249.48:8061/ws/kafka/CellStatus-Test-DemoF023FTC04/

  IoT
  ws://172.22.249.48:8061/ws/Shanghai-kafka/Test-Demo-F02-3FTC-04-Demo_Type_A:1/


  ws://172.22.249.48:8061/ws/kafka/CellStatus-PMXICU-MATRIXF0102/
  http://localhost:5001/test/fake_data
  ws://172.22.249.48:8061/ws/Shanghai-kafka/PMXICU-MATRIX-F0-1-02-adas_bot_cover_assembly_machine:1/ 
  
  */

  const dataPanelError = (id) => {
    const res = fetchError.filter((data) => data.dataName === id);
    if (res[0]?.fetchError === true) return true;
    else return false;
  };

  const dataPanelErrorMessage = (id) => {
    const res = fetchErrorMessage.filter((data) => data.dataName === id);
    return res[0]?.fetchErrorMessage;
  };

  const dataPanelURL = (id) => {
    const res = textValue?.filter((text) => text.dataName === id);
    return res[0]?.datasource_url;
  };

  const [inputs, setInputs] = useState(variablesArray);

  //border: "1px solid black"
  return (
    <Box sx={{ margin: "5px" }}>
      {dataArray?.map((data) => {
        const error = dataPanelError(data.dataName);
        const errorMsg = dataPanelErrorMessage(data.dataName);
        const currenturl = dataPanelURL(data.dataName);
        return (
          <div key={data.dataName}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                margin: "1.5rem 0rem",
                padding: "1rem",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ margin: "0.5rem 0rem" }}
              >
                <DataPanelName
                  dataPanelName={data.dataLabel}
                  dataPanelID={data.dataName}
                  panelID={panelID}
                />
                <Button
                  onClick={() => {
                    const dataPanelID = data.dataName;
                    dispatch(removeDataPanel({ panelID, dataPanelID }));
                  }}
                  disabled={dataArray.length <= 1}
                >
                  <DeleteIcon />
                </Button>
              </Box>

              <Box display="flex" alignItems="center">
                <StyleButton>URL</StyleButton>

                <DataSourceTextField
                  data={data}
                  error={error}
                  errorMsg={errorMsg}
                  currenturl={currenturl}
                  panelID={panelID}
                  typeofData={typeofData}
                  fetchURl={fetchURl}
                  variablesArray={variablesArray}
                  setTextValue={setTextValue}
                  textValue={textValue}
                  datasource_url={data.datasource_url}
                  dataDetail={data.dataDetail}
                  connectWS={connectWS}
                />
                <InspectorButton
                  data={data}
                  setTargetDataPanel={setTargetDataPanel}
                  setDrawerOpen={setDrawerOpen}
                />
              </Box>

              {variablesArray.length ? (
                <VariableAccordion
                  fetchURl={fetchURl}
                  panelID={panelID}
                  dataPanelID={data.dataName}
                  setTextValue={setTextValue}
                  textValue={textValue}
                  inputs={inputs}
                  setInputs={setInputs}
                />
              ) : (
                ""
              )}
              {error ? null : (
                <ColumnSelectAccordion panelID={panelID} data={data} />
              )}
            </div>
            <DivideLine />
          </div>
        );
      })}
      <InspectDrawer
        dataPanelID={targetDataPanel}
        panelID={panelID}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <Button
        onClick={() => {
          dispatch(addDataPanel({ panelID }));
        }}
      >
        <AddIcon />
      </Button>
    </Box>
  );
};

export default DataSourceBlock;
