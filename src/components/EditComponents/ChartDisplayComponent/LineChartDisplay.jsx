import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CartesianAxis,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ColorSettingDialog from "./ColorSettingDialog";
import {
  cleanChartData,
  RechartsCustomTooltip,
  set_domain_max,
  set_domain_min,
  tickFormatter,
  zoomInChart,
} from "./helper/helper";

const LineChartDisplay = ({
  data,
  xKey,
  yKey,
  styleSetting,
  otherSetting,
  dataLimit,
  keysColor,
  editPage,
}) => {
  let data_index = cleanChartData(data, "index", dataLimit);
  data_index.map((data) => {
    yKey.forEach((y) => {
      if (y !== xKey) {
        // console.log(Number(data[y]))
        data[y] =
          (data[y] || data[y] === 0) && !Number.isNaN(Number(data[y]))
            ? Number(data[y])
            : null;
      }
    });
  });

  const { colorOption } = useSelector((state) => {
    return {
      colorOption: state.chartSetting.color,
    };
  });

  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");
  const [refLeft, setRefLeft] = useState("");
  const [refRight, setRefRight] = useState("");
  const [ticks, setTicks] = useState(data_index.map((item) => item.index));
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) {
      setLeft("dataMin");
      setRight("dataMax");
      setTicks(data_index.map((item) => item.index));
    }
  }, [data]);

  const labelFormatter = (value) => {
    if (data_index[value] !== undefined) {
      return data_index[value][xKey];
    }
    return "";
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [legendDetail, setLegendDetail] = useState({});

  const handelLegendClick = (e) => {
    if (editPage) {
      setOpenDialog(true);
      setLegendDetail({ key: e.dataKey, color: e.color });
    }
  };
  return (
    <>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <LineChart
          data={data_index}
          layout={styleSetting.layout}
          margin={{
            top: 0,
            right: 15,
            bottom: 0,
            left: 5,
          }}
          onMouseDown={(e) => {
            if (e !== null) {
              setRefLeft(e.activeLabel);
            } else {
              setRefLeft("");
            }
          }}
          onMouseMove={(e) => {
            if (refLeft !== "") {
              setRefRight(e?.activeLabel);
            }
          }}
          onMouseUp={(e) => {
            if (refLeft !== "" && e !== null) {
              // zoomIn(e.activeLabel)
              zoomInChart(
                e.activeLabel,
                refLeft,
                setRefLeft,
                setZoomed,
                setLeft,
                setRight,
                setTicks,
                ticks
              );
            }
            setRefRight("");
          }}
        >
          <CartesianGrid
            strokeDasharray={otherSetting.RechartPanel.stroke}
            opacity={otherSetting.RechartPanel.strokeOpacity}
          />
          <XAxis
            dataKey={styleSetting.layout === "horizontal" ? "index" : null}
            type="number" //{styleSetting.layout === 'horizontal' ? 'category' : 'number'}
            hide={otherSetting.RechartXaxis.hide}
            orientation={otherSetting.RechartXaxis.orientation}
            textAnchor={otherSetting.RechartXaxis.textAnchor}
            // interval={otherSetting.RechartXaxis.interval}
            angle={otherSetting.RechartXaxis.angle}
            fontSize={otherSetting.RechartXaxis.fontSize}
            // padding={otherSetting.RechartXaxis.padding}
            // tickFormatter={tickFormatter}
            allowDataOverflow
            domain={
              styleSetting.layout === "horizontal"
                ? [left, right]
                : [set_domain_min, set_domain_max]
            }
            // tickFormatter={styleSetting.layout === 'horizontal' ? tickFormatter : null}
            tickFormatter={
              styleSetting.layout === "horizontal"
                ? (value) => tickFormatter(value, data_index, xKey, "index")
                : (value) => tickFormatter(value)
            }
            ticks={styleSetting.layout === "horizontal" ? ticks : null}
            tick={{ fill: "#c4c4c4" }}
          >
            {otherSetting.RechartXaxis.label_hide ? null : (
              <Label
                value={otherSetting.RechartXaxis.label_value}
                angle={0}
                position={otherSetting.RechartXaxis.label_position}
              />
            )}
          </XAxis>
          <YAxis
            dataKey={styleSetting.layout === "vertical" ? "index" : null}
            type="number" //{styleSetting.layout === 'vertical' ? 'category' : 'number'}
            hide={otherSetting.RechartYaxis.hide}
            orientation={otherSetting.RechartYaxis.orientation}
            textAnchor={otherSetting.RechartYaxis.textAnchor}
            // interval={otherSetting.RechartYaxis.interval}
            angle={otherSetting.RechartYaxis.angle}
            fontSize={otherSetting.RechartYaxis.fontSize}
            // padding={otherSetting.RechartYaxis.padding}
            allowDataOverflow
            domain={
              styleSetting.layout === "vertical"
                ? [left, right]
                : [set_domain_min, set_domain_max]
            }
            // tickFormatter={styleSetting.layout === 'vertical' ? tickFormatter : null}
            tickFormatter={
              styleSetting.layout === "vertical"
                ? (value) => tickFormatter(value, data_index, xKey, "index")
                : (value) => tickFormatter(value)
            }
            ticks={styleSetting.layout === "vertical" ? ticks : null}
            tick={{ fill: "#c4c4c4" }}
          >
            {otherSetting.RechartYaxis.label_hide ? null : (
              <Label
                value={otherSetting.RechartYaxis.label_value}
                angle={180}
                position={otherSetting.RechartYaxis.label_position}
              />
            )}
          </YAxis>
          {otherSetting.RechartLegend.show ? (
            <Legend
              layout={otherSetting.RechartLegend.layout}
              align={otherSetting.RechartLegend.align}
              verticalAlign={otherSetting.RechartLegend.verticalAlign}
              iconType={otherSetting.RechartLegend.iconType}
              wrapperStyle={
                otherSetting.RechartLegend.layout === "vertical"
                  ? { paddingLeft: "30px", height: "80%", overflow: "auto" }
                  : otherSetting.RechartLegend.verticalAlign === "top"
                  ? { paddingBottom: "15px" }
                  : { paddingTop: "15px" }
              }
              onClick={(e) => handelLegendClick(e)}
            />
          ) : null}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(85, 91, 102, 0.6)",
              borderColor: "#555b66",
              textAnchor: "start",
            }}
            wrapperStyle={{
              height: "150px",
              overflow: "auto",
              pointerEvents: "auto",
            }}
            labelStyle={{ color: "white" }}
            position={{ y: 0 }}
            labelFormatter={labelFormatter}
          />
          {yKey.map((y, idx) => {
            const key_idx = keysColor.findIndex(
              (key_color) => key_color.key === y
            );
            let color = colorOption[idx % 20];
            if (key_idx !== -1) {
              color = keysColor[key_idx].color;
            }
            return (
              <Line
                key={y}
                dataKey={y}
                type={styleSetting.type}
                dot={styleSetting.dot}
                activeDot={styleSetting.activeDot}
                strokeWidth={styleSetting.strokeWidth}
                stroke={color}
                connectNulls
                isAnimationActive={false}
              />
            );
          })}

          {refLeft !== "" && refRight !== "" ? (
            <ReferenceArea
              y1={styleSetting.layout === "vertical" ? refLeft : null}
              y2={styleSetting.layout === "vertical" ? refRight : null}
              x1={styleSetting.layout === "horizontal" ? refLeft : null}
              x2={styleSetting.layout === "horizontal" ? refRight : null}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>

      {editPage && (
        <ColorSettingDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          legendDetail={legendDetail}
          setLegendDetail={setLegendDetail}
        />
      )}
    </>
  );
};

export default LineChartDisplay;
