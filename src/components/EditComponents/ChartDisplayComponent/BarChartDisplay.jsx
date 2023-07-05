import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
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
  set_domain_max,
  set_domain_min,
  tickFormatter,
  zoomInChart,
} from "./helper/helper";

const BarChartDisplay = ({
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
        data[y] =
          (data[y] || data[y] === 0) && !Number.isNaN(Number(data[y]))
            ? Number(data[y])
            : null;
      }
    });
  });
  // console.log(tmp, data_index)

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
        <BarChart
          data={data_index}
          layout={styleSetting.layout}
          barCategoryGap={styleSetting.barCategoryGap}
          barGap={styleSetting.barGap}
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
              // zoomIn(e.activeLabel)
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
            type="number"
            // type={styleSetting.layout === 'horizontal' ? 'category' : 'number'}
            hide={otherSetting.RechartXaxis.hide}
            orientation={otherSetting.RechartXaxis.orientation}
            textAnchor={otherSetting.RechartXaxis.textAnchor}
            // interval={otherSetting.RechartXaxis.interval}
            angle={otherSetting.RechartXaxis.angle}
            fontSize={otherSetting.RechartXaxis.fontSize}
            // padding={otherSetting.RechartXaxis.padding}
            allowDataOverflow
            domain={
              styleSetting.layout === "horizontal"
                ? [left, right]
                : [set_domain_min, set_domain_max]
            } //{['dataMin', 'dataMax']}
            // tickFormatter={styleSetting.layout === 'horizontal' ? tickFormatter : null}
            tickFormatter={
              styleSetting.layout === "horizontal"
                ? (value) => tickFormatter(value, data_index, xKey, "index")
                : (value) => tickFormatter(value)
            }
            ticks={styleSetting.layout === "horizontal" ? ticks : null}
            // ticks={data_index.map((item) => item.index)}
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
            } //{['dataMin', 'dataMax']}
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
                angle={0}
                position={otherSetting.RechartYaxis.label_position}
              />
            )}
          </YAxis>
          {/* <Tooltip contentStyle={{ backgroundColor: '#555b66' }} cursor={{ stroke: '#333333' }} /> */}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(85, 91, 102, 0.95)",
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
          {yKey.map((y, idx) => {
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
                stackId={styleSetting.stackId}
                stroke={color}
                fill={color}
                fillOpacity={styleSetting.fillOpacity}
                isAnimationActive={false}
                barSize={data_index.length === 1 ? 20 : null}
              >
                {/* {styleSetting.label_show ? (
                <LabelList dataKey={y} position={styleSetting.label_position} />
              ) : null} */}
              </Bar>
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
        </BarChart>
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

export default BarChartDisplay;
