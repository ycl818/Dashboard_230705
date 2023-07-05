import { current, nanoid } from "@reduxjs/toolkit";
import * as dfd from "danfojs";

export const merge = (panel_dataFrames) => {
  let panel_df = panel_dataFrames.map((data) => data.dataFrame);
  panel_df = panel_df.filter((df) => df.shape[1] > 0);

  if (panel_df.length === 1) {
    return [
      {
        dataName: panel_dataFrames[0].dataName,
        dataLabel: "Merge",
        dataFrame: panel_df[0],
      },
    ];
  } else if (panel_df.length > 0) {
    panel_df = dfd.concat({ dfList: panel_df, axis: 0 });
    return [
      {
        dataName: panel_dataFrames[0].dataName,
        dataLabel: "Merge",
        dataFrame: panel_df,
      },
    ];
  }
  return [
    {
      dataName: nanoid(),
      dataLabel: "Merge",
      dataFrame: new dfd.DataFrame([]),
    },
  ];
};

export const concatenateFields = (panel_dataFrames) => {
  let panel_df = panel_dataFrames.map((data) => data.dataFrame);
  panel_df = panel_df.filter((df) => df.shape[1] > 0);

  if (panel_df.length === 1) {
    return [
      {
        dataName: panel_dataFrames[0].dataName,
        dataLabel: "Concatenate Fields",
        dataFrame: panel_df[0],
      },
    ];
  } else if (panel_df.length > 0) {
    panel_df = dfd.concat({ dfList: panel_df, axis: 1 });
    return [
      {
        dataName: panel_dataFrames[0].dataName,
        dataLabel: "Concatenate Fields",
        dataFrame: panel_df,
      },
    ];
  }
  return [
    {
      dataName: nanoid(),
      dataLabel: "Concatenate Fields",
      dataFrame: new dfd.DataFrame([]),
    },
  ];
};

const AGG_FUNC = [
  "count",
  "sum",
  "std",
  "var",
  "mean",
  "max",
  "min",
  "cumSum",
  "cumMax",
  "cumProd",
  "cummin",
];
export const groupby = (panel_dataFrames, options) => {
  // options = [
  //   {
  //     target_table: 'id',
  //     groupby: ['col_1', '...'],
  //     calculate: {
  //       'col_1': ['sum', 'mean'],
  //       'col_2': []
  //     }
  //   },
  //   ...
  // ]
  if (options.length === 0) {
    return panel_dataFrames;
  } else if (
    options.map((option) => option.groupby.length === 0).every(Boolean)
  ) {
    return panel_dataFrames;
  } else {
    let grouped_data = [];
    for (const option of options) {
      const groupby_cols = option.groupby;
      const all_calculates = option.calculate;

      const target_index = panel_dataFrames.findIndex(
        (panel) => panel.dataName === option.target_table
      );
      const taget_dataLabel = panel_dataFrames[target_index].dataLabel;
      let target_df = panel_dataFrames[target_index].dataFrame;

      if (Object.keys(all_calculates) === 0) {
        if (target_df.shape[1] === 0) {
          grouped_data.push({
            dataName: option.target_table,
            dataLabel: taget_dataLabel,
            dataFrame: target_df,
          });
        } else {
          grouped_data.push({
            dataName: option.target_table,
            dataLabel: taget_dataLabel,
            dataFrame: target_df
              .groupby(groupby_cols)
              .count()
              .loc({ columns: groupby_cols }),
          });
        }
      } else {
        if (target_df.shape[1] > 0) {
          const agg_options = Object.fromEntries(
            Object.entries(all_calculates)
              .map(([column, calculates]) => {
                return [
                  column,
                  calculates.filter((cal) => AGG_FUNC.includes(cal)),
                ];
              })
              .filter((cal_option) => cal_option[1].length > 0)
          );

          // const apply_options = Object.fromEntries(
          //   Object.entries(all_calculates).map(([column, calculates]) => {
          //     return [column, calculates.filter((cal) => !AGG_FUNC.includes(cal))]
          //   }).filter((cal_option) => cal_option[1].length > 0)
          // )
          const apply_options = {};

          let group_df = new dfd.DataFrame();
          if (
            Object.keys(agg_options).length === 0 &&
            Object.keys(apply_options).length === 0
          ) {
            target_df.addColumn("tmp", new Array(target_df.shape[0]).fill(0), {
              inplace: true,
            });
            group_df = target_df
              .groupby(groupby_cols)
              .count()
              .loc({ columns: groupby_cols });
          } else if (
            Object.keys(agg_options).length > 0 &&
            Object.keys(apply_options).length > 0
          ) {
            //分別 agg & apply 再合併成一個df
          } else if (Object.keys(agg_options).length > 0) {
            group_df = target_df.groupby(groupby_cols).agg(agg_options);
          } else {
            // apply
          }
          grouped_data.push({
            dataName: option.target_table,
            dataLabel: taget_dataLabel,
            dataFrame: group_df,
          });
        } else {
          grouped_data.push({
            dataName: option.target_table,
            dataLabel: taget_dataLabel,
            dataFrame: target_df,
          });
        }
      }
    }
    return grouped_data;
  }
};

export const filterByName = (panel_dataFrames, options) => {
  // options = [
  //   {
  //     target_table: 'id',
  //     filter_columns: []
  //   },
  //   ...
  // ]
  if (options.length === 0) {
    return panel_dataFrames;
  } else {
    const target_table = options.map((option) => option.target_table);
    let filter_data = panel_dataFrames.filter(
      (panel) => !target_table.includes(panel.dataName)
    );

    for (const option of options) {
      const target_index = panel_dataFrames.findIndex(
        (panel) => panel.dataName === option.target_table
      );
      const taget_dataLabel = panel_dataFrames[target_index].dataLabel;
      const target_df = panel_dataFrames[target_index].dataFrame;
      if (target_df.shape[1] === 0) {
        filter_data.push({
          dataName: option.target_table,
          dataLabel: taget_dataLabel,
          dataFrame: target_df,
        });
      } else {
        if (target_df.columns !== option.filter_columns) {
          filter_data.push({
            dataName: option.target_table,
            dataLabel: taget_dataLabel,
            dataFrame: target_df.drop({ columns: option.filter_columns }),
          });
        }
      }
    }
    return filter_data;
  }
};

export const sortby = (panel_dataFrames, options) => {
  // options = [
  //   {
  //     target_table: 'id',
  //     target_label: '',
  //     sort_column: 'col name',
  //     reverse: true
  //   }
  // ]
  if (options.length === 0) {
    return panel_dataFrames;
  } else {
    if (options[0].sort_column === "") {
      return panel_dataFrames;
    } else {
      let sortby_data = panel_dataFrames.filter(
        (panel) => panel.dataName !== options[0].target_table
      );
      const target_index = panel_dataFrames.findIndex(
        (panel) => panel.dataName === options[0].target_table
      );
      const taget_dataLabel = panel_dataFrames[target_index].dataLabel;
      const target_df = panel_dataFrames[target_index].dataFrame;
      if (target_df.shape[1] === 0) {
        sortby_data.push({
          dataName: options[0].target_table,
          dataLabel: taget_dataLabel,
          dataFrame: target_df,
        });
      } else {
        sortby_data.push({
          dataName: options[0].target_table,
          dataLabel: taget_dataLabel,
          dataFrame: target_df.sortValues(options[0].sort_column, {
            ascending: options[0].reverse,
          }),
        });
      }
      return sortby_data;
    }
  }
};

export const convertType = (panel_dataFrames, options) => {
  // options = [
  //   {
  //     target_table: 'id',
  //     target_label: 'A, B, ...',
  //     column: 'col name',
  //     astype: 'string, int32, ...'
  //   },
  //   ...
  // ]
  if (options.length === 0) {
    return panel_dataFrames;
  } else {
    let convertType_data = panel_dataFrames.filter(
      (panel) =>
        !options.map((option) => option.target_table).includes(panel.dataName)
    );
    let target_data = panel_dataFrames.filter((panel) =>
      options.map((option) => option.target_table).includes(panel.dataName)
    );
    for (const option of options) {
      const target_index = target_data.findIndex(
        (panel) => panel.dataName === option.target_table
      );
      // const taget_dataLabel = panel_dataFrames[target_index].dataLabel
      const target_df = target_data[target_index].dataFrame;
      if (target_df.shape[1] !== 0) {
        target_data[target_index] = {
          dataName: option.target_table,
          dataLabel: option.target_label,
          dataFrame: target_df.asType(option.column, option.astype),
        };
      }
    }
    convertType_data = [].concat(convertType_data, target_data);
    return convertType_data;
  }
};

export const renameFields = (panel_dataFrames, options) => {
  // options = [
  //   {
  //     target_table: 'id',
  //     rename_columns: { 'col name': 'new col name', 'col name 2': 'new col name', ... }
  //   },
  //   ...
  // ]
  if (options.length === 0) {
    return panel_dataFrames;
  } else {
    const target_table = options.map((option) => option.target_table);
    let filter_data = panel_dataFrames.filter(
      (panel) => !target_table.includes(panel.dataName)
    );
    for (const option of options) {
      // let clean_rename_columns = option.rename_columns;

      const target_index = panel_dataFrames.findIndex(
        (panel) => panel.dataName === option.target_table
      );
      const taget_dataLabel = panel_dataFrames[target_index].dataLabel;
      const target_df = panel_dataFrames[target_index].dataFrame;
      filter_data.push({
        dataName: option.target_table,
        dataLabel: taget_dataLabel,
        dataFrame: target_df.rename(option.rename_columns),
      });
      // filter_data.push({
      //   dataName: option.target_table,
      //   dataLabel: taget_dataLabel,
      //   dataFrame: target_df.rename(clean_rename_columns),
      // });
    }
    return filter_data;
  }
};
