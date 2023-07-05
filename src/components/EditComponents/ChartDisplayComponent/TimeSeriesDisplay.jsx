import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  Bar,
  BarChart,
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
  timeTickFormatter,
  zoomInChart,
} from "./helper/helper";

const TimeSeriesDisplay = ({
  data,
  yKey,
  styleSetting,
  otherSetting,
  dataLimit,
  keysColor,
  editPage,
}) => {
  const xKey = "timestamp ";
  const chart_type = styleSetting.setting.chartStyle;
  const time_frame = styleSetting.setting.timeFrame;
  const now_timestamp = new Date().getTime();
  const past_timestamp = now_timestamp - time_frame.value;
  console.log("🚀 ~ file: TimeSeriesDisplay.jsx:42 ~ time_frame:", time_frame);
  // console.log('data', data)

  let datetime_data = cleanChartData(data, "datetime", dataLimit, xKey);
  datetime_data.map((data) => {
    yKey.forEach((y) => {
      if (y !== xKey) {
        data[y] =
          (data[y] || data[y] === 0) && !Number.isNaN(Number(data[y]))
            ? Number(data[y])
            : null;
      }
    });
  });

  // console.log(datetime_data, xKey, yKey)

  const { colorOption } = useSelector((state) => {
    return {
      colorOption: state.chartSetting.color,
    };
  });

  const [left, setLeft] = useState(past_timestamp - 1);
  const [right, setRight] = useState(now_timestamp + 1);
  const [refLeft, setRefLeft] = useState("");
  const [refRight, setRefRight] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const [barsize, setBarsize] = useState(1);

  useEffect(() => {
    setLeft(past_timestamp - 1);
    setRight(now_timestamp + 1);
  }, [time_frame]);

  useEffect(() => {
    if (!zoomed) {
      setLeft(past_timestamp - 1);
      setRight(now_timestamp + 1);
      setBarsize(1);
    }
  }, [data]);

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
          data={datetime_data}
          layout="horizontal"
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
                null,
                null,
                1,
                10000
              );
              setBarsize(5);
            }
            setRefRight("");
          }}
        >
          <CartesianGrid
            strokeDasharray={otherSetting.RechartPanel.stroke}
            opacity={otherSetting.RechartPanel.strokeOpacity}
          />
          <XAxis
            dataKey={xKey}
            type="number"
            // scale='time'
            hide={otherSetting.RechartXaxis.hide}
            orientation={otherSetting.RechartXaxis.orientation}
            textAnchor={otherSetting.RechartXaxis.textAnchor}
            // interval={otherSetting.RechartXaxis.interval}
            angle={otherSetting.RechartXaxis.angle}
            fontSize={otherSetting.RechartXaxis.fontSize}
            padding="gap" //{otherSetting.RechartXaxis.padding}
            allowDataOverflow
            domain={[left, right]}
            tickFormatter={(value) =>
              timeTickFormatter(value, right, left, time_frame.value)
            }
            interval="preserveStartEnd"
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
            type="number"
            hide={otherSetting.RechartYaxis.hide}
            orientation={otherSetting.RechartYaxis.orientation}
            textAnchor={otherSetting.RechartYaxis.textAnchor}
            // interval={otherSetting.RechartYaxis.interval}
            angle={otherSetting.RechartYaxis.angle}
            fontSize={otherSetting.RechartYaxis.fontSize}
            // padding={otherSetting.RechartYaxis.padding}
            // domain={['dataMin', 'dataMax']}
            domain={[set_domain_min, set_domain_max]}
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
            labelFormatter={(value) =>
              timeTickFormatter(value, right, left, time_frame.value)
            }
          />
          {chart_type === "Line"
            ? yKey.map((y, idx) => {
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
                    type={styleSetting.LineSetting.type}
                    dot={styleSetting.LineSetting.dot}
                    activeDot={styleSetting.LineSetting.activeDot}
                    strokeWidth={styleSetting.LineSetting.strokeWidth}
                    stroke={color}
                    connectNulls
                    isAnimationActive={false}
                  />
                );
              })
            : null}

          {chart_type === "Area"
            ? yKey.map((y, idx) => {
                const key_idx = keysColor.findIndex(
                  (key_color) => key_color.key === y
                );
                let color = colorOption[idx % 20];
                if (key_idx !== -1) {
                  color = keysColor[key_idx].color;
                }
                return (
                  <Area
                    key={y}
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
              })
            : null}

          {chart_type === "Bar"
            ? yKey.map((y, idx) => {
                const key_idx = keysColor.findIndex(
                  (key_color) => key_color.key === y
                );
                let color = colorOption[idx % 20];
                if (key_idx !== -1) {
                  color = keysColor[key_idx].color;
                }
                return (
                  <Bar
                    key={y}
                    dataKey={y}
                    stackId={styleSetting.BarSetting.stackId}
                    stroke={color}
                    fill={color}
                    fillOpacity={styleSetting.BarSetting.fillOpacity}
                    isAnimationActive={false}
                    barSize={barsize}
                  />
                );
              })
            : null}

          {refLeft !== "" && refRight !== "" ? (
            <ReferenceArea x1={refLeft} x2={refRight} strokeOpacity={0.3} />
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

export default TimeSeriesDisplay;
