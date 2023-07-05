import { current } from "@reduxjs/toolkit";
import * as dfd from "danfojs";
import {
  concatenateFields,
  merge,
  groupby,
  filterByName,
  sortby,
  convertType,
  renameFields,
} from "./transformFunction";

export const dataLabelCreate = (num) => {
  var str = "",
    q,
    r;
  while (num > 0) {
    q = (num - 1) / 26;
    r = (num - 1) % 26;
    num = Math.floor(q);
    str = String.fromCharCode(65 + r) + str;
  }
  return str;
};

export const chackDataType = (data) => {
  if (Array.isArray(data)) {
    if (
      data.length === 0 ||
      (!Array.isArray(data[0]) && typeof data[0] === "object")
    ) {
      return true;
    }
  }
  return false;
};

export const getValueFromKeys = (obj, keys) => {
  if (keys.length === 1) {
    return obj[keys[0]];
  }
  const current_key = keys[0];
  const current_obj = obj[current_key];
  if (current_obj === undefined) {
    return "";
  }
  return getValueFromKeys(current_obj, keys.slice(1));
};

export const getSelectData = (selected_cols, selected_names, current_data) => {
  let unique_name = selected_names.filter((name) => {
    return selected_names.indexOf(name) === selected_names.lastIndexOf(name);
  });
  let cols_name = unique_name.map((name) => {
    return { name, cols: selected_cols[unique_name.indexOf(name)] };
  });

  let selected_data = current_data.map((data_obj) => {
    let row_data = cols_name.map(({ name, cols }) => {
      let val = getValueFromKeys(data_obj, cols);
      if (!Array.isArray(val) && typeof val === "object")
        val = "[object Object]";
      if (Array.isArray(val)) val = "[object Array]";
      return [name + " ", val];
    });
    return Object.fromEntries(row_data);
  });

  return selected_data;
};
export const getTransformData = (panelData, transformRules) => {
  // transformRules = [
  //   { id: "merge", options: [] },
  //   {
  //     id: "groupBy",
  //     options: [
  //       {
  //         target_table: 'B',
  //         groupby: ['col_1', '...'],
  //         calculate: {
  //           'col_1': ['sum', 'mean'],
  //           'col_2': []
  //         }
  //       }
  //     ]
  //   },
  //   { id: "sortBy", options: [] },
  //   ...
  // ]

  let panel_dataFrames = panelData.map((data) => {
    let df = new dfd.DataFrame(data.dataTable).fillNa("");
    return {
      dataName: data.dataName,
      dataLabel: data.dataLabel,
      dataFrame: df,
    };
  });
  let transform_dataColumns = [];
  let error = false;
  for (let i = 0; i < transformRules.length; i++) {
    transform_dataColumns.push(
      panel_dataFrames.map((data) => {
        return {
          dataName: data.dataName,
          dataLabel: data.dataLabel,
          columns: data.dataFrame.columns,
        };
      })
    );
    try {
      switch (transformRules[i].id) {
        case "merge":
          panel_dataFrames = merge(panel_dataFrames);
          break;
        case "concatenate_fields":
          panel_dataFrames = concatenateFields(panel_dataFrames);
          break;
        case "groupby":
          panel_dataFrames = groupby(
            panel_dataFrames,
            transformRules[i].options
          );
          break;
        case "filterByName":
          panel_dataFrames = filterByName(
            panel_dataFrames,
            transformRules[i].options
          );
          break;
        case "sortby":
          panel_dataFrames = sortby(
            panel_dataFrames,
            transformRules[i].options
          );
          break;
        case "convertType":
          panel_dataFrames = convertType(
            panel_dataFrames,
            transformRules[i].options
          );
          break;
        case "renameFields":
          panel_dataFrames = renameFields(
            panel_dataFrames,
            transformRules[i].options
          );
          break;
        default:
          break;
      }
    } catch {
      error = true;
    }
  }

  const data_order = panelData.map((data) => data.dataName);
  panel_dataFrames = panel_dataFrames
    .map((data) => {
      let df = data.dataFrame.fillNa("");
      return {
        dataName: data.dataName,
        dataLabel: data.dataLabel,
        dataTable: dfd.toJSON(df),
      };
    })
    .sort(
      (a, b) => data_order.indexOf(a.dataName) - data_order.indexOf(b.dataName)
    );

  // order by widget.data.dataName here....
  return { transform_dataColumns, panel_dataFrames, error };
};
