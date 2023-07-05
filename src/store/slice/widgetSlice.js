import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import { createSlice, current, isAnyOf, nanoid } from "@reduxjs/toolkit";
import {
  chackDataType,
  dataLabelCreate,
  getSelectData,
  getTransformData,
  getValueFromKeys,
} from "./helper/helpWidget";

const initialState = {
  dashboardName: "New dashboard",
  widgetArray:
    [
      {
        i: nanoid(),
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        panelName: "",
        typeOfData: "Static",
        streamingOption: "Collect",
        staticQueryInterval: 0,
        data: [
          {
            dataLabel: "A",
            dataName: nanoid(),
            datasource: null,
            datasource_url: null,
            dataType: null,
            dataDetail: null,
            fetchError: false,
            fetchErrorMessage: "",

            acceptType: false,
            columnSelect: [],
            columnName: [],
            dataTable: [],
          },
        ],

        chart_data: [],
        transform_dataColumns: [], //[[{dataName: 'id', dataLabel: 'string...', column: []}]]
        transform_rules: [],
        data_limit: 100,

        chart_option: {
          chartType: null,
          setting: {
            style: {}, // bar, area, pie... setting detail
            other: {}, // tooltip, axis, legend... setting detail
            keysColor: [],
          },
          x_key: "",
          y_key: [],
        },
      },
    ] || [],
};

const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    changeStaticQueryInterval: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].staticQueryInterval =
        action.payload.staticQueryInterval;
    },
    changeStreamingOption: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].streamingOption =
        action.payload.streamingOption;
    },
    changeTypeOfData: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      if (
        state.widgetArray[panelIndex].typeOfData !== action.payload.typeOfData
      ) {
        state.widgetArray[panelIndex].transform_rules = state.widgetArray[
          panelIndex
        ].transform_rules.map((rule) => {
          return { id: rule.id, options: [] };
        });
      }
      state.widgetArray[panelIndex].typeOfData = action.payload.typeOfData;
    },
    loadUploadDashboardName: (state, action) => {
      state.dashboardName = action.payload.dashboardName;
    },
    updateDashboardName: (state, action) => {
      state.dashboardName = action.payload;
    },
    fetchErrorShowBorder: (state, action) => {
      console.log(action);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.id
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );
      state.widgetArray[panelIndex].data[dataPanelId].fetchError =
        action.payload.res;
      state.widgetArray[panelIndex].data[dataPanelId].fetchErrorMessage =
        action.payload.message;
    },
    fetchExistDashboard: (state, action) => {
      console.log(action.payload.data);
      state.widgetArray = action.payload.panelArray;
    },
    updateDataSourceWithURL: (state, action) => {
      //console.log("update URL~~~~~~~~~~", action.payload);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );

      state.widgetArray[panelIndex].data[dataPanelId].datasource_url =
        action.payload.datasource_url;
      state.widgetArray[panelIndex].data[dataPanelId].datasource =
        action.payload.datasourceName;

      // // ?????????????
      // state.widgetArray[panelIndex].transform_rules = state.widgetArray[
      //   panelIndex
      // ].transform_rules.map((rule) => {
      //   return { id: rule.id, options: [] };
      // });
    },
    updatePanelName: (state, action) => {
      console.log(action.payload);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].panelName = action.payload.name;
    },
    loadUploadData: (state, action) => {
      //console.log(action.payload.widgetArray);
      state.widgetArray = action.payload.widgetArray;
    },
    updateDataType: (state, action) => {
      //console.log(action);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].data.dataType = action.payload.selectedType;
    },
    updateData: (state, action) => {
      //console.log("🚀 ~ file: widgetSlice.js:107 ~ action:", action.payload);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );

      // state.widgetArray[panelIndex].data[dataPanelId].dataDetail =
      //   action.payload?.data;

      // console.log('check update data, original', current(state.widgetArray[panelIndex].data))
      // console.log('check update data, action.payload', action.payload)
      let queried_data = action.payload?.data;
      if (!Array.isArray(queried_data) && typeof queried_data === "object")
        queried_data = [queried_data];
      state.widgetArray[panelIndex].data[dataPanelId].dataDetail = queried_data;

      const acceptType = chackDataType(queried_data);
      state.widgetArray[panelIndex].data[dataPanelId].acceptType = acceptType;
      if (!acceptType) {
        state.widgetArray[panelIndex].data[dataPanelId].dataTable = [];
      }
    },
    updataDataPanel: (state, action) => {
      console.log("🚀 ~ file: widgetSlice.js:117 ~ action:", action.payload);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );

      state.widgetArray[panelIndex].data = action.payload.textValue;
    },
    addDataPanel: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );

      const data_num = state.widgetArray[panelIndex].data.length;
      const all_dataLabel = state.widgetArray[panelIndex].data.map(
        (d) => d.dataLabel
      );
      let label = dataLabelCreate(data_num + 1);
      if (all_dataLabel.includes(label)) {
        for (let i = 1; i <= data_num + 1; i++) {
          label = dataLabelCreate(i);
          if (!all_dataLabel.includes(label)) break;
        }
      }

      state.widgetArray[panelIndex].data = [
        ...state.widgetArray[panelIndex].data,
        {
          // dataLabel: "New Source",
          dataLabel: label,
          dataName: nanoid(),
          datasource: null,
          datasource_url: null,
          dataType: null,
          dataDetail: null,
          fetchError: false,
          fetchErrorMessage: "",

          acceptType: false,
          columnSelect: [],
          columnName: [],
          dataTable: [],
        },
      ];
    },
    removeDataPanel: (state, action) => {
      console.log("Remove data panel~~", action.payload);
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );

      state.widgetArray[panelIndex].data.splice(dataPanelId, 1);
      // clear tansform...
      // check transform rules.options[idx].target_table
      for (
        let i = 0;
        i < state.widgetArray[panelIndex].transform_rules.length;
        i++
      ) {
        const option_idx = state.widgetArray[panelIndex].transform_rules[
          i
        ].options.findIndex(
          (option) => option.target_table === action.payload.dataPanelID
        );
        if (option_idx !== -1) {
          state.widgetArray[panelIndex].transform_rules[i].options.splice(
            option_idx,
            1
          );
        }
      }
    },
    updateDataSourceName: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );
      state.widgetArray[panelIndex].data[dataPanelId].dataLabel =
        action.payload?.name;
    },
    modifyLayouts: (state, action) => {
      // const tempArray = state.widgetArray.map((widget) => ({
      //   ...widget,
      //   data: { ...widget.data },
      // }));
      const tempArray = [...state.widgetArray];
      // console.log("temp:", tempArray);
      //console.log(action);
      action.payload.layouts?.forEach((position) => {
        const widgetIndex = tempArray.findIndex(
          (widget) => widget.i === position.i
        );
        if (widgetIndex !== -1) {
          tempArray[Number(widgetIndex)].x = position.x;
          tempArray[Number(widgetIndex)].y = position.y;
          tempArray[Number(widgetIndex)].w = position.w;
          tempArray[Number(widgetIndex)].h = position.h;
        }
      });
      state.widgetArray = tempArray;
    },
    addWidget: (state) => {
      const panelNumber = state.widgetArray?.length;
      const defaultDataId = nanoid();
      state.widgetArray = [
        ...state.widgetArray,
        {
          i: nanoid(),
          x: 0,
          y: -1.5 * panelNumber,
          w: 4,
          h: 2,
          panelName: "",
          typeOfData: "Static",
          streamingOption: "Collect",
          staticQueryInterval: 0,
          data: [
            {
              dataLabel: "A",
              dataName: defaultDataId,
              datasource: null,
              datasource_url: null,
              dataType: null,
              dataDetail: null,
              fetchError: false,
              fetchErrorMessage: "",

              acceptType: false,
              columnSelect: [],
              columnName: [],
              dataTable: [],
            },
          ],

          chart_data: [],
          transform_dataColumns: [],
          transform_rules: [],
          data_limit: 100,

          chart_option: {
            chartType: null,
            setting: {
              style: {},
              other: {},
              keysColor: [],
            },
            x_key: "",
            y_key: [],
          },
        },
      ];
    },
    deleteWidget: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.id
      );
      const tempArray = [...state.widgetArray];
      tempArray.splice(panelIndex, 1);
      state.widgetArray = tempArray;
    },
    cleanUpAllPanel: (state, action) => {
      console.log(action);
      state.widgetArray = initialState;
    },

    setChartOption: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelId
      );
      state.widgetArray[panelIndex].chart_option = action.payload.chartOption;
    },
    setDefaultColumnSelect: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );
      const dataDetail =
        state.widgetArray[panelIndex].data[dataPanelId].dataDetail;

      if (Array.isArray(dataDetail)) {
        if (
          !Array.isArray(dataDetail[0]) &&
          typeof dataDetail[0] === "object"
        ) {
          state.widgetArray[panelIndex].data[dataPanelId].columnSelect =
            Object.keys(dataDetail[0]).map((k) => [k]);
          state.widgetArray[panelIndex].data[dataPanelId].columnName =
            Object.keys(dataDetail[0]);
        }
      }
    },
    setColumnSelect: (state, action) => {
      // action.payload = {panelID, dataPanelID (dataName), colIdx, keyIdx, action: string (update/add/deleteCol/deleteKey), value: string (from select)}
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );
      const columnIndex = action.payload.colIdx;
      const keyIndex = action.payload.keyIdx;

      if (action.payload.action === "add_col") {
        state.widgetArray[panelIndex].data[dataPanelId].columnSelect.push(
          action.payload.value
        );
        state.widgetArray[panelIndex].data[dataPanelId].columnName.push(
          action.payload.value[0]
        );
      } else if (action.payload.action === "update_key") {
        state.widgetArray[panelIndex].data[dataPanelId].columnSelect[
          columnIndex
        ][keyIndex] = action.payload.value;
        const updated_keys = state.widgetArray[panelIndex].data[
          dataPanelId
        ].columnSelect[columnIndex].slice(0, keyIndex + 1);
        state.widgetArray[panelIndex].data[dataPanelId].columnSelect[
          columnIndex
        ] = updated_keys;
      } else if (action.payload.action === "add_key") {
        state.widgetArray[panelIndex].data[dataPanelId].columnSelect[
          columnIndex
        ].push(action.payload.value);
      } else if (action.payload.action === "delete_col") {
        state.widgetArray[panelIndex].data[dataPanelId].columnSelect.splice(
          columnIndex,
          1
        );
        state.widgetArray[panelIndex].data[dataPanelId].columnName.splice(
          columnIndex,
          1
        );
        state.widgetArray[panelIndex].transform_rules = state.widgetArray[
          panelIndex
        ].transform_rules.map((rule) => {
          return { id: rule.id, options: [] };
        });
      } else if (action.payload.action === "delete_key") {
        state.widgetArray[panelIndex].data[dataPanelId].columnSelect[
          columnIndex
        ].splice(keyIndex, 1);
      }
    },
    setColumnName: (state, action) => {
      // action.payload = {panelID, dataPanelID (dataName), colIdx, value, nameError
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
        (data) => data.dataName === action.payload.dataPanelID
      );
      const columnIndex = action.payload.colIdx;
      state.widgetArray[panelIndex].data[dataPanelId].columnName[columnIndex] =
        action.payload.value;
      state.widgetArray[panelIndex].transform_rules = state.widgetArray[
        panelIndex
      ].transform_rules.map((rule) => {
        return { id: rule.id, options: [] };
      });
    },
    addTransformRules: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].transform_rules.push(action.payload.rule);
    },
    deleteTransformRule: (state, action) => {
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );

      state.widgetArray[panelIndex].transform_rules.splice(
        action.payload.transformIndex,
        1
      );
    },
    updateTransformRules: (state, action) => {
      // action.payload = {panelId, transformIndex, rule}
      // rule = {id: "", options: {...}}
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].transform_rules[
        action.payload.transformIndex
      ] = action.payload.rule;

      const total_rules = state.widgetArray[panelIndex].transform_rules.length;
      if (action.payload.transformIndex < total_rules - 1) {
        for (let i = action.payload.transformIndex + 1; i < total_rules; i++) {
          state.widgetArray[panelIndex].transform_rules[i].options = [];
        }
      }
      // console.log(current(state.widgetArray[panelIndex].transform_rules));
    },
    setDataLimit: (state, action) => {
      // action.payload = {panelId, limit}
      const panelIndex = state.widgetArray.findIndex(
        (panel) => panel.i === action.payload.panelID
      );
      state.widgetArray[panelIndex].data_limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          updateData,
          setDefaultColumnSelect,
          setColumnSelect,
          setColumnName
        ),
        (state, action) => {
          const panelIndex = state.widgetArray.findIndex(
            (panel) => panel.i === action.payload.panelID
          );
          const dataPanelId = state.widgetArray[panelIndex].data.findIndex(
            (data) => data.dataName === action.payload.dataPanelID
          );
          if (state.widgetArray[panelIndex].data[dataPanelId].acceptType) {
            let selected_cols =
              state.widgetArray[panelIndex].data[dataPanelId].columnSelect;
            let selected_names =
              state.widgetArray[panelIndex].data[dataPanelId].columnName;
            let current_data =
              state.widgetArray[panelIndex].data[dataPanelId].dataDetail;
            ///// this filter not working -> still have the same problem???
            // fix it in connect socket -> not sure if this is correct
            if (current_data.length > 0) {
              current_data = current_data.filter(
                (data) => data !== undefined || data !== null
              );
              if (selected_cols.length === 0) {
                selected_cols = Object.keys(current_data[0]).map((k) => [k]);
                selected_names = Object.keys(current_data[0]);
              }
              state.widgetArray[panelIndex].data[dataPanelId].dataTable =
                getSelectData(selected_cols, selected_names, current_data);
            } else {
              state.widgetArray[panelIndex].data[dataPanelId].dataTable = [];
            }

            const panelData = state.widgetArray[panelIndex].data.map((data) => {
              return {
                dataName: data.dataName,
                dataLabel: data.dataLabel,
                dataTable: data.dataTable,
              };
            });

            // transform below....
            if (state.widgetArray[panelIndex].transform_rules.length > 0) {
              const { transform_dataColumns, panel_dataFrames, error } =
                getTransformData(
                  panelData,
                  state.widgetArray[panelIndex].transform_rules
                );
              state.widgetArray[panelIndex].chart_data = panel_dataFrames;
              state.widgetArray[panelIndex].transform_dataColumns =
                transform_dataColumns;
            } else {
              state.widgetArray[panelIndex].chart_data = JSON.parse(
                JSON.stringify(panelData)
              );
              state.widgetArray[panelIndex].transform_dataColumns = [];
            }
          } else {
            const panelData = state.widgetArray[panelIndex].data.map((data) => {
              return {
                dataName: data.dataName,
                dataLabel: data.dataLabel,
                dataTable: data.dataTable,
              };
            });

            console.log(
              "check not accept:",
              current(state.widgetArray[panelIndex].data)
            );
            state.widgetArray[panelIndex].chart_data = JSON.parse(
              JSON.stringify(panelData)
            );
            state.widgetArray[panelIndex].transform_dataColumns = [];
            // if (state.widgetArray[panelIndex].transform_rules.length > 0) {
            //   const update_transform_rules = state.widgetArray[
            //     panelIndex
            //   ].transform_rules.map((rule) => {
            //     return { id: rule.id, options: [] };
            //   });
            //   state.widgetArray[panelIndex].transform_rules =
            //     update_transform_rules;
            //   const { transform_dataColumns, panel_dataFrames } =
            //     getTransformData(panelData, update_transform_rules);
            //   state.widgetArray[panelIndex].chart_data = panel_dataFrames;
            //   state.widgetArray[panelIndex].transform_dataColumns =
            //     transform_dataColumns;
            // } else {
            //   state.widgetArray[panelIndex].chart_data = JSON.parse(
            //     JSON.stringify(panelData)
            //   );
            //   state.widgetArray[panelIndex].transform_dataColumns = [];
            // }
          }
        }
      )
      .addMatcher(
        isAnyOf(
          removeDataPanel,
          addTransformRules,
          deleteTransformRule,
          updateTransformRules
        ),
        (state, action) => {
          const panelIndex = state.widgetArray.findIndex(
            (panel) => panel.i === action.payload.panelID
          );

          const panelData = state.widgetArray[panelIndex].data?.map((data) => {
            return {
              dataName: data.dataName,
              dataLabel: data.dataLabel,
              dataTable: data.dataTable,
            };
          });

          if (state.widgetArray[panelIndex].transform_rules.length > 0) {
            const { transform_dataColumns, panel_dataFrames, error } =
              getTransformData(
                panelData,
                state.widgetArray[panelIndex].transform_rules
              );
            state.widgetArray[panelIndex].chart_data = panel_dataFrames;
            state.widgetArray[panelIndex].transform_dataColumns =
              transform_dataColumns;
          } else {
            state.widgetArray[panelIndex].chart_data = JSON.parse(
              JSON.stringify(panelData)
            );
            state.widgetArray[panelIndex].transform_dataColumns = [];
          }
        }
      );
  },
});

export const {
  modifyLayouts,
  addWidget,
  deleteWidget,
  updateData,
  updateDataType,
  loadUploadData,
  updatePanelName,
  updateDataSourceWithURL,
  fetchExistDashboard,
  fetchErrorShowBorder,
  cleanUpAllPanel,
  updateDashboardName,
  loadUploadDashboardName,
  addDataPanel,
  removeDataPanel,
  updataDataPanel,
  updateDataSourceName,
  changeTypeOfData,
  changeStreamingOption,
  changeStaticQueryInterval,

  setChartOption,
  setDefaultColumnSelect,
  setColumnSelect,
  setColumnName,
  addTransformRules,
  deleteTransformRule,
  updateTransformRules,
  setDataLimit,
} = widgetSlice.actions;
export const widgetReducer = widgetSlice.reducer;
