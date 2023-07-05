import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
} from "recharts";
import ColorSettingDialog from "./ColorSettingDialog";
import { cleanChartData } from "./helper/helper";

const PieChartDisplay = ({
  data,
  xKey,
  yKey,
  styleSetting,
  otherSetting,
  dataLimit,
  keysColor,
  editPage,
}) => {
  const { colorOption } = useSelector((state) => {
    return {
      colorOption: state.chartSetting.color,
    };
  });
  const [activeSlice, setActiveSlice] = useState(null);

  let data_index = cleanChartData(data, "index", dataLimit);
  data_index.map((data) => {
    data[yKey[0]] =
      (data[yKey[0]] || data[yKey[0]] === 0) &&
      !Number.isNaN(Number(data[yKey[0]]))
        ? Number(data[yKey[0]])
        : null;
  });

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 5}
        outerRadius={outerRadius + 5}
        fill={fill}
      />
    );
  };

  const renderCustomizedLabel = (e) => {
    const RADIAN = Math.PI / 180;
    const radius = e.innerRadius + (e.outerRadius - e.innerRadius) * 0.7;

    const x = e.cx + radius * Math.cos(-e.midAngle * RADIAN);
    const y = e.cy + radius * Math.sin(-e.midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="central"
      >
        {styleSetting.label_text === "percent"
          ? `${(e[styleSetting.label_text] * 100).toFixed(0)}%`
          : e[styleSetting.label_text]}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgb(130, 136, 151, 0.9)",
            display: "flex",
            textAlign: "center",
            padding: 10,
            color: payload[0].payload.fill,
          }}
        >
          {`${payload[0].name} : ${payload[0].value}`}
        </div>
      );
    }

    return null;
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [legendDetail, setLegendDetail] = useState({});

  const handelLegendClick = (e) => {
    console.log(e);
    if (editPage) {
      setOpenDialog(true);
      setLegendDetail({ key: e.value, color: e.color });
    }
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <PieChart
          margin={{
            top: 0,
            right: 5,
            bottom: 0,
            left: 5,
          }}
        >
          {otherSetting.RechartLegend.show ? (
            <Legend
              layout={otherSetting.RechartLegend.layout}
              align={otherSetting.RechartLegend.align}
              verticalAlign={otherSetting.RechartLegend.verticalAlign}
              payload={data_index.map((item, idx) => {
                const key_idx = keysColor.findIndex(
                  (key_color) => key_color.key === item[xKey]
                );
                let color = colorOption[idx % 20];
                if (key_idx !== -1) {
                  color = keysColor[key_idx].color;
                }
                return {
                  // id: item.name,
                  type: otherSetting.RechartLegend.iconType,
                  value: item[xKey],
                  color: color,
                  payload: { strokeDasharray: "" },
                };
              })}
              wrapperStyle={
                otherSetting.RechartLegend.layout === "vertical"
                  ? { height: "80%", overflow: "auto" }
                  : otherSetting.RechartLegend.verticalAlign === "top"
                  ? { paddingBottom: "15px" }
                  : { paddingTop: "15px" }
              }
              onClick={(e) => handelLegendClick(e)}
            />
          ) : null}
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data_index}
            dataKey={yKey[0]}
            nameKey={xKey}
            innerRadius={styleSetting.innerRadius}
            outerRadius={styleSetting.outerRadius}
            paddingAngle={styleSetting.paddingAngle}
            label={styleSetting.label ? renderCustomizedLabel : false}
            labelLine={false}
            isAnimationActive={false}
            activeIndex={activeSlice}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => {
              setActiveSlice(index);
            }}
            onMouseOut={() => setActiveSlice(null)}
          >
            {data_index.map((item, idx) => {
              const key_idx = keysColor.findIndex(
                (key_color) => key_color.key === item[xKey]
              );
              let color = colorOption[idx % 20];
              if (key_idx !== -1) {
                color = keysColor[key_idx].color;
              }
              return (
                <Cell
                  key={idx}
                  fill={color}
                  stroke={color}
                  style={{ outline: "none" }}
                />
              );
            })}
          </Pie>
        </PieChart>
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

export default PieChartDisplay;
