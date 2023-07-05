import { Add, Close, DeleteForever } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransformRules } from "../../store";
import Merge from "./TransformComponent/Merge";
import GroupBy from "./TransformComponent/GroupBy";
import FilterByName from "./TransformComponent/FilterByName";
import SortBy from "./TransformComponent/SortBy";
import ConvertType from "./TransformComponent/ConvertType";
import RenameFields from "./TransformComponent/RenameFields";

const TransformBlock = ({ panelID }) => {
  const [showCombo, setShowCombo] = useState(false);

  const dispatch = useDispatch();
  const { transformRules, chartData } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);

    return {
      transformRules: targetPanel[0]?.transform_rules,
      chartData: targetPanel[0]?.chart_data,
    };
  });

  const tranform_options = [
    {
      id: "concatenate_fields",
      title: "Concatenate fields",
      detail: "detail...",
    },
    { id: "merge", title: "Merge", detail: "detail..." },
    { id: "groupby", title: "Group by", detail: "detail..." },
    { id: "filterByName", title: "Filter by name", detail: "detail..." },
    { id: "sortby", title: "Sort by", detail: "detail..." },
    { id: "convertType", title: "Convert field type", detail: "detail..." },
    { id: "renameFields", title: "Rename fields", detail: "detail..." },
  ];

  const rule_switcher = (rule, index) => {
    const ruleId = rule.id;
    const ruleOption = rule.options;

    switch (ruleId) {
      case "merge":
        return (
          <Merge
            panelID={panelID}
            transformIndex={index}
            name="Merge"
            key={index}
          />
        );
      case "concatenate_fields":
        return (
          <Merge
            panelID={panelID}
            transformIndex={index}
            name="Concatenate fields"
            key={index}
          />
        );

      case "groupby":
        return (
          <GroupBy
            panelID={panelID}
            transformIndex={index}
            name="GroupBy"
            key={index}
          />
        );

      case "filterByName":
        return (
          <FilterByName
            panelID={panelID}
            transformIndex={index}
            name="Filter by name"
            key={index}
          />
        );

      case "sortby":
        return (
          <SortBy
            panelID={panelID}
            transformIndex={index}
            name="Sort by"
            key={index}
          />
        );
      case "convertType":
        return (
          <ConvertType
            panelID={panelID}
            transformIndex={index}
            name="Convert field type"
            key={index}
          />
        );
      case "renameFields":
        return (
          <RenameFields
            panelID={panelID}
            transformIndex={index}
            name="Rename fields"
            key={index}
          />
        );
      default:
        break;
    }
  };

  const AddTransformBtn = () => {
    return (
      <Box paddingTop={2}>
        <Button
          onClick={() => setShowCombo(!showCombo)}
          sx={{ textTransform: "none" }}
          disabled={chartData.length === 0}
        >
          <Add />
          Add transformation
        </Button>
      </Box>
    );
  };

  return (
    <Box paddingTop={2}>
      {transformRules?.map((rule, index) => rule_switcher(rule, index))}

      {showCombo && (
        <Autocomplete
          id="combo-box"
          options={tranform_options}
          getOptionLabel={(option) => option.title}
          renderOption={(props, option) => (
            <ListItemButton
              key={option.id}
              sx={{ borderBottom: 1, borderColor: "#333333" }}
              onClick={(e) => {
                setShowCombo(false);
                dispatch(
                  addTransformRules({
                    panelID: panelID,
                    rule: { id: option.id, options: [] },
                  })
                );
              }}
            >
              <ListItemText primary={option.title} secondary={option.detail} />
            </ListItemButton>
          )}
          renderInput={(params) => <TextField {...params} />}
          open={showCombo}
          onClose={() => setShowCombo(false)}
          popupIcon={<Close />}
          disablePortal={true}
          size="small"
          sx={{ width: "100%", paddingTop: 2 }}
        />
      )}

      {!showCombo && <AddTransformBtn />}
    </Box>
  );
};

export default TransformBlock;
