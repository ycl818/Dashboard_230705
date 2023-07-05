import { Circle, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Input,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatStyle } from "../../../store";

const StatChartSetting = () => {
  const dispatch = useDispatch();
  const statStyle = useSelector((state) => state.statSetting.value);
  const [accordionExpand, setAccordionExpand] = useState(false);
  const [unit, setUnit] = useState(statStyle.unit);
  const [threshold, setThreshold] = useState(statStyle.threshold);

  const calculation_option = [
    "mean",
    "min",
    "max",
    "total",
    "first",
    "last",
    "count",
  ];
  const color_option = [
    { color: "gray", code: "#979797" },
    { color: "green", code: "#37BF5D" },
    { color: "yellow", code: "#F09222" },
    { color: "red", code: "#FF2D64" },
  ];

  return (
    <Accordion
      expanded={accordionExpand}
      onChange={() => setAccordionExpand(!accordionExpand)}
      disableGutters={true}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Stat Setting</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{ p: 1.5, border: 1, borderColor: "#333333", borderRadius: 1 }}
        >
          <Stack
            spacing={0.5}
            direction="column"
            sx={{ mb: 3 }}
            alignItems="left"
          >
            <Typography variant="body2">Value Calculation</Typography>
            <Select
              value={statStyle.calculation}
              fullWidth
              size="small"
              onChange={(e) =>
                dispatch(
                  setStatStyle({ type: "calculation", value: e.target.value })
                )
              }
            >
              {calculation_option.map((option) => (
                <MenuItem value={option}>{option}</MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack spacing={1} direction="row" sx={{ mb: 3 }} alignItems="left">
            <Typography variant="body2" marginTop={1}>
              Unit
            </Typography>
            {/* unit text field -> onBlur dispatch */}
            <TextField
              size="small"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              onBlur={() =>
                dispatch(setStatStyle({ type: "unit", value: unit }))
              }
            />
          </Stack>

          <Stack spacing={0.5} direction="row" sx={{ mb: 3 }} alignItems="left">
            <Typography variant="body2">Graph Mode</Typography>
            <Switch
              checked={statStyle.withArea}
              size="small"
              onChange={(e) =>
                dispatch(
                  setStatStyle({ type: "withArea", value: e.target.checked })
                )
              }
            />
          </Stack>

          <Stack
            spacing={0.5}
            direction="column"
            sx={{ mb: 3 }}
            alignItems="left"
          >
            <Typography variant="body2">Color Mode</Typography>
            <ToggleButtonGroup
              value={statStyle.colorMode}
              exclusive
              size="small"
              onChange={(e) =>
                dispatch(
                  setStatStyle({ type: "colorMode", value: e.target.value })
                )
              }
            >
              <ToggleButton value="none">None</ToggleButton>
              <ToggleButton value="value">Value</ToggleButton>
              <ToggleButton value="background">Background</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack
            spacing={0.5}
            direction="column"
            sx={{ mb: 3 }}
            alignItems="left"
          >
            <Typography variant="body2">Base Color Select</Typography>
            <Select
              value={statStyle.baseColor}
              fullWidth
              size="small"
              onChange={(e) =>
                dispatch(
                  setStatStyle({ type: "baseColor", value: e.target.value })
                )
              }
            >
              {color_option.map((option) => (
                <MenuItem value={option.color}>
                  <Circle
                    fontSize="small"
                    style={{ color: option.code, marginRight: 5 }}
                  />
                  {option.color}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack spacing={0.5} direction="row" sx={{ mb: 3 }} alignItems="left">
            <Typography variant="body2">Set Threshold</Typography>
            <Switch
              checked={statStyle.setThreshold}
              size="small"
              onChange={(e) =>
                dispatch(
                  setStatStyle({
                    type: "setThreshold",
                    value: e.target.checked,
                  })
                )
              }
            />
          </Stack>

          {statStyle.setThreshold ? (
            <Stack
              direction="column"
              spacing={2}
              sx={{ mb: 3 }}
              alignItems="left"
            >
              {color_option.map((option) => {
                return (
                  <Stack direction="row" spacing={2}>
                    <Circle
                      fontSize="small"
                      style={{
                        color: option.code,
                        marginRight: 5,
                        marginTop: 10,
                      }}
                    />
                    <OutlinedInput
                      size="small"
                      value={threshold[option.color]}
                      onChange={(e) =>
                        setThreshold((prev) => {
                          return {
                            ...prev,
                            [option.color]:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          };
                        })
                      }
                      onBlur={() =>
                        dispatch(
                          setStatStyle({ type: "threshold", value: threshold })
                        )
                      }
                      inputProps={{ step: 0.01, type: "number" }}
                    />
                  </Stack>
                );
              })}
            </Stack>
          ) : null}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(StatChartSetting);
