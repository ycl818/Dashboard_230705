import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ColorSettingDialog from "./ColorSettingDialog";
import {
  cleanChartData,
  set_domain_max,
  set_domain_min,
  tickFormatter,
  zoomInChart,
} from "./helper/helper";

const ComposeDisplay = ({
  data,
  xKey,
  styleSetting,
  otherSetting,
  dataLimit,
  keysColor,
  editPage,
}) => {
  let data_index = cleanChartData(data, "index", dataLimit);
  // data.map((item, index) => ({ index, ...item }))//.slice(-100);

  const all_y_keys = [
    ...new Set(
      [].concat(
        styleSetting.keys.BarKey,
        styleSetting.keys.AreaKey,
        styleSetting.keys.LineKey
      )
    ),
  ];
  data_index.map((data) => {
    all_y_keys.forEach((y) => {
      if (y !== xKey) {
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

  const [left, setLeft] = useState("dataMin-0.5");
  const [right, setRight] = useState("dataMax+0.5");
  const [refLeft, setRefLeft] = useState("");
  const [refRight, setRefRight] = useState("");
  const [ticks, setTicks] = useState(data_index.map((item) => item.index));
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) {
      setLeft("dataMin-0.5");
      setRight("dataMax+0.5");
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
        <ComposedChart
          data={data_index}
          layout={styleSetting.AreaSetting.layout}
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
                ticks,
                0.5
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
            dataKey={
              styleSetting.AreaSetting.layout === "horizontal" ? "index" : null
            }
            type="number"
            // type={styleSetting.AreaSetting.layout === 'horizontal' ? 'category' : 'number'}
            // type={otherSetting.RechartXaxis.type}
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
              styleSetting.AreaSetting.layout === "horizontal"
                ? [left, right]
                : [set_domain_min, set_domain_max]
            } //{['dataMin', 'dataMax']}
            // tickFormatter={styleSetting.AreaSetting.layout === 'horizontal' ? tickFormatter : null}
            tickFormatter={
              styleSetting.AreaSetting.layout === "horizontal"
                ? (value) => tickFormatter(value, data_index, xKey, "index")
                : (value) => tickFormatter(value)
            }
            ticks={
              styleSetting.AreaSetting.layout === "horizontal" ? ticks : null
            }
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
            dataKey={
              styleSetting.AreaSetting.layout === "vertical" ? "index" : null
            }
            type="number"
            // type={styleSetting.AreaSetting.layout === 'vertical' ? 'category' : 'number'}
            // type={otherSetting.RechartYaxis.type}
            hide={otherSetting.RechartYaxis.hide}
            orientation={otherSetting.RechartYaxis.orientation}
            textAnchor={otherSetting.RechartYaxis.textAnchor}
            // interval={otherSetting.RechartYaxis.interval}
            angle={otherSetting.RechartYaxis.angle}
            fontSize={otherSetting.RechartYaxis.fontSize}
            // padding={otherSetting.RechartYaxis.padding}
            allowDataOverflow
            domain={
              styleSetting.AreaSetting.layout === "vertical"
                ? [left, right]
                : [set_domain_min, set_domain_max]
            } //{['dataMin', 'dataMax']}
            // tickFormatter={styleSetting.AreaSetting.layout === 'vertical' ? tickFormatter : null}
            tickFormatter={
              styleSetting.AreaSetting.layout === "vertical"
                ? (value) => tickFormatter(value, data_index, xKey, "index")
                : (value) => tickFormatter(value)
            }
            ticks={
              styleSetting.AreaSetting.layout === "vertical" ? ticks : null
            }
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
              wrapperStyle={
                otherSetting.RechartLegend.layout === "vertical"
                  ? { paddingLeft: "30px", height: "80%", overflow: "auto" }
                  : otherSetting.RechartLegend.verticalAlign === "top"
                  ? { paddingBottom: "15px" }
                  : { paddingTop: "15px" }
              }
              onClick={(e) => handelLegendClick(e)}
              // iconType={otherSetting.RechartLegend.iconType}
            />
          ) : null}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(85, 91, 102, 0.8)",
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

          {styleSetting.keys.BarKey.map((y, idx) => {
            const key_idx = keysColor.findIndex(
              (key_color) => key_color.key === y
            );
            let color = colorOption[idx % 20];
            if (key_idx !== -1) {
              color = keysColor[key_idx].color;
            }
            return (
              <Bar
                key={"bar" + y}
                dataKey={y}
                stackId={styleSetting.BarSetting.stackId}
                stroke={color}
                fill={color}
                fillOpacity={styleSetting.BarSetting.fillOpacity}
                isAnimationActive={false}
              >
                {/* {styleSetting.BarSetting.label_show ? (
              <LabelList dataKey={y} position={styleSetting.BarSetting.label_position} />
            ) : null} */}
              </Bar>
            );
          })}
          {styleSetting.keys.LineKey.map((y, idx) => {
            const key_idx = keysColor.findIndex(
              (key_color) => key_color.key === y
            );
            let color =
              colorOption[(idx + styleSetting.keys.BarKey.length) % 20];
            if (key_idx !== -1) {
              color = keysColor[key_idx].color;
            }
            return (
              <Line
                key={"line" + y}
                dataKey={y}
                type={styleSetting.LineSetting.type}
                dot={styleSetting.LineSetting.dot}
                activeDot={styleSetting.LineSetting.activeDot}
                strokeWidth={styleSetting.LineSetting.strokeWidth}
                stroke={color}
                connectNulls
                isAnimationActive={false}
              />
            );
          })}
          {styleSetting.keys.AreaKey.map((y, idx) => {
            const key_idx = keysColor.findIndex(
              (key_color) => key_color.key === y
            );
            let color =
              colorOption[
                (idx +
                  styleSetting.keys.BarKey.length +
                  styleSetting.keys.LineKey.length) %
                  20
              ];
            if (key_idx !== -1) {
              color = keysColor[key_idx].color;
            }
            return (
              <Area
                key={"area" + y}
                dataKey={y}
                type={styleSetting.AreaSetting.type}
                stackId={styleSetting.AreaSetting.stackId}
                dot={styleSetting.AreaSetting.dot}
                activeDot={styleSetting.AreaSetting.activeDot}
                strokeWidth={styleSetting.AreaSetting.strokeWidth}
                fillOpacity={styleSetting.AreaSetting.fillOpacity}
                stroke={color}
                fill={color}
                connectNulls
                isAnimationActive={false}
              />
            );
          })}

          {refLeft !== "" && refRight !== "" ? (
            <ReferenceArea
              y1={
                styleSetting.AreaSetting.layout === "vertical" ? refLeft : null
              }
              y2={
                styleSetting.AreaSetting.layout === "vertical" ? refRight : null
              }
              x1={
                styleSetting.AreaSetting.layout === "horizontal"
                  ? refLeft
                  : null
              }
              x2={
                styleSetting.AreaSetting.layout === "horizontal"
                  ? refRight
                  : null
              }
              strokeOpacity={0.3}
            />
          ) : null}
        </ComposedChart>
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

export default ComposeDisplay;
