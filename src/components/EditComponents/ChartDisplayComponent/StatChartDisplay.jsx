import { Box } from "@mui/material";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Text,
  XAxis,
  YAxis,
} from "recharts";
import {
  calculateStat,
  cleanChartData,
  getStatColor,
  set_stat_domain,
} from "./helper/helper";

const StatChartDisplay = ({ data, yKey, styleSetting, dataLimit }) => {
  let limit_data = cleanChartData(data, "index", dataLimit);

  limit_data.map((data) => {
    data[yKey[0]] =
      (data[yKey[0]] || data[yKey[0]] === 0) &&
      !Number.isNaN(Number(data[yKey[0]]))
        ? Number(data[yKey[0]])
        : null;
  });
  const statValue = calculateStat(
    limit_data.map((d) => d[yKey[0]]),
    styleSetting.calculation
  );
  const { backgroundColor, textColor, areaStroke, areaColor } = getStatColor(
    statValue,
    styleSetting.setThreshold,
    styleSetting.baseColor,
    styleSetting.colorMode,
    styleSetting.threshold
  );

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={50}>
      <AreaChart
        data={limit_data}
        margin={{
          top: 0,
          right: 5,
          bottom: 0,
          left: 5,
        }}
        className="statFont"
      >
        <CartesianGrid strokeOpacity={0} fill={backgroundColor} />

        <svg
          style={{
            width: "100%",
            height: "auto",
          }}
          viewBox={styleSetting.withArea ? "0 0 200 500" : "0 0 200 400"}
        >
          <text
            style={{
              transform: "translate(100px, 200px)",
              fontSize: 100,
              fontWeight: "bold",
              textAnchor: "middle",
              fill: textColor,
            }}
          >
            {statValue}
            <tspan font-size="50">{" " + styleSetting.unit}</tspan>
          </text>
        </svg>

        {styleSetting.withArea ? (
          <YAxis domain={set_stat_domain} hide={true} />
        ) : null}
        {styleSetting.withArea ? (
          <Area
            dataKey={yKey[0]}
            fill={areaColor}
            strokeWidth={1}
            stroke={areaStroke}
            isAnimationActive={false}
            fillOpacity={styleSetting.colorMode === "background" ? 1 : 0.15}
            connectNulls
          />
        ) : null}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StatChartDisplay;
