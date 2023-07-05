import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchErrorShowBorder, updateData } from "../store";
import axios from "axios";

const QueryStaticURL = ({
  datasource_url,
  panelInterval,
  dataName,
  panelID,
  variablesArray,
}) => {
  const dispatch = useDispatch();

  const fetchURl = useCallback(
    async (
      variablesArray,
      currentText = datasource_url,
      dataPanelID = dataName
    ) => {
      try {
        // Define default values for each variable
        let defaultValues = {};
        variablesArray.forEach(({ variableName, defaultValue }) => {
          defaultValues[variableName] = defaultValue;
        });
        console.log("[Dashboard Page]: before regex:", currentText);

        currentText = currentText.replace(/@(\w+)/g, (match, variableName) => {
          const variableValue = defaultValues[variableName];
          return variableValue !== undefined ? variableValue : match;
        });
        console.log("[Dashboard Page]: after regex:", currentText);

        const response = await axios.get(currentText);
        const data = response?.data;
        dispatch(updateData({ data, panelID, dataPanelID }));
        const res = false;
        const id = panelID;
        const message = "";
        dispatch(fetchErrorShowBorder({ id, res, message, dataPanelID }));
      } catch (error) {
        console.log("file: QueryStaticURL.jsx:41 ~ error:", error);
        const res = true;
        const id = panelID;
        const message = error.message;
        dispatch(fetchErrorShowBorder({ id, res, message, dataPanelID }));
        dispatch(updateData({ data: [], panelID, dataPanelID }));
      }
    },
    []
  );

  useEffect(() => {
    let staticIntervel;
    if (datasource_url !== null) {
      if (panelInterval > 0) {
        staticIntervel = setInterval(() => {
          fetchURl(variablesArray);
        }, panelInterval * 1000);
      } else {
        fetchURl(variablesArray);
      }
    }

    return () => clearInterval(staticIntervel);
  }, [datasource_url, variablesArray]);
  return <></>;
};

export default QueryStaticURL;
