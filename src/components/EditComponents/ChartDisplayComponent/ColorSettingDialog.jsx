import { Rectangle } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CirclePicker, MaterialPicker, SketchPicker } from "react-color";
import { HexColorInput, RgbaStringColorPicker } from "react-colorful";
import { useDispatch } from "react-redux";
import { setKeysColorEdit } from "../../../store/slice/chart/chartDataSlice";

const ColorSettingDialog = ({
  openDialog,
  setOpenDialog,
  legendDetail,
  setLegendDetail,
}) => {
  console.log(
    "🚀 ~ file: ColorSettingDialog.jsx:25 ~ legendDetail:",
    legendDetail
  );
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const colorPicker = [
    "#d88484",
    "#f44336",
    "#e91e63",
    "#974dbf",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
  ];

  useEffect(() => {
    dispatch(setKeysColorEdit(legendDetail));
  }, [legendDetail]);

  const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
  };

  const rgbaToHex = (rgba) => {
    let a;
    let rgb = rgba
      .replace(/\s/g, "")
      .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
    let hex = rgb
      ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
        (rgb[2] | (1 << 8)).toString(16).slice(1) +
        (rgb[3] | (1 << 8)).toString(16).slice(1)
      : "#FFFFFF";
    return hex;
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false);
        // setLegendDetail({});
      }}
    >
      <DialogContent
        sx={{ backgroundColor: "#232323", height: "343px", width: "248px" }}
      >
        <Box>
          <Tabs
            value={tab}
            onChange={(e, newTabIndex) => {
              setTab(newTabIndex);
            }}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{ paddingBottom: 1, width: "100%" }}
          >
            <Tab
              label="Colors"
              sx={{ backgroundColor: tab ? "#303030" : "#232323" }}
            />
            <Tab
              label="Custom"
              sx={{ backgroundColor: tab ? "#232323" : "#303030" }}
            />
          </Tabs>
        </Box>

        {tab === 0 ? (
          <div style={{ marginTop: "20px", marginLeft: "12px" }}>
            {legendDetail.color && (
              <CirclePicker
                color={
                  legendDetail.color[0] === "#"
                    ? legendDetail.color
                    : rgbaToHex(legendDetail.color)
                }
                onChange={(color) => {
                  setLegendDetail({
                    ...legendDetail,
                    color: color.hex,
                  });
                }}
                colors={colorPicker}
                circleSize={33}
                width="100%"
              />
            )}
          </div>
        ) : null}
        {tab === 1 ? (
          <div>
            {legendDetail.color && (
              <>
                <RgbaStringColorPicker
                  className="custom-layout"
                  color={
                    legendDetail.color[0] === "#"
                      ? hexToRGB(legendDetail.color)
                      : legendDetail.color
                  }
                  onChange={(color) =>
                    setLegendDetail({
                      ...legendDetail,
                      color: color,
                    })
                  }
                  style={{ marginTop: "5px" }}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    // variant="contained"
                    sx={{
                      marginTop: "10px",
                      backgroundColor: legendDetail.color,
                    }}
                    disabled
                  />
                  <HexColorInput
                    style={{
                      display: "block",
                      boxSizing: "border-box",
                      width: "128px",
                      marginTop: "10px",
                      padding: "3px",
                      border: "1px solid #161616",
                      borderRadius: "3px",
                      background: "#161616",
                      outline: "none",
                      font: "inherit",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "white",
                    }}
                    color={
                      legendDetail.color[0] === "#"
                        ? legendDetail.color
                        : rgbaToHex(legendDetail.color)
                    }
                    onChange={(color) =>
                      setLegendDetail({
                        ...legendDetail,
                        color: color.length === 0 ? "#FFFFFF" : color,
                      })
                    }
                    prefixed={true}
                  />
                </Stack>
              </>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ColorSettingDialog);
