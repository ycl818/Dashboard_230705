export const cleanChartData = (chart_data, type, dataLimit, x_key = null) => {
  // let data_num = isStreaming ? dataLimit : chart_data.length
  if (type === "index") {
    return chart_data
      .slice(-dataLimit)
      .map((item, index) => ({ index, ...item }));
  } else if (type === "datetime") {
    return chart_data
      .map((item) => ({
        ...item,
        [x_key]:
          item[x_key] && !Number.isNaN(Number(item[x_key]))
            ? Math.floor(Number(item[x_key]) * 1000)
            : 0,
      }))
      .sort((a, b) => a[x_key] - b[x_key])
      .slice(-dataLimit);
  } else {
    return JSON.parse(JSON.stringify(chart_data.slice(-dataLimit)));
  }
};

export const tickFormatter = (value, data = null, key = null, type = null) => {
  const limit = 6; // put your maximum character
  if (type === "index") {
    if (data[value] !== undefined) {
      let v = String(data[value][key]);
      if (v.length <= limit) return v;
      return `${v.slice(0, limit - 3)}...`;
    }
    return "";
  } else {
    let v = String(value);
    if (v.length <= limit) return v;
    return `${v.slice(0, limit - 1)}...`;
  }
};

export const timeTickFormatter = (value, right_time, left_time, time_frame) => {
  const datetime = new Date(value);
  let year = String(datetime.getFullYear());
  if (year === "1970") {
    return undefined;
  }

  let month = String(datetime.getMonth() + 1);
  let day = String(datetime.getDate());
  let hr = String(datetime.getHours());
  let min = String(datetime.getMinutes());
  let sec = String(datetime.getSeconds());
  let millisec = String(datetime.getMilliseconds());

  month = month.length === 1 ? "0" + month : month;
  day = day.length === 1 ? "0" + day : day;
  hr = hr.length === 1 ? "0" + hr : hr;
  min = min.length === 1 ? "0" + min : min;
  sec = sec.length === 1 ? "0" + sec : sec;
  millisec = millisec.length === 1 ? "0" + millisec : millisec.slice(0, 2);

  let interval = right_time - left_time;
  let final_label = "";
  if (interval <= 10000) {
    final_label = `${min}:${sec}.${millisec}`;
    if (time_frame > 86400000) return `${month}/${day} ${final_label}`;
  } else if (interval <= 5 * 60 * 1000) {
    final_label = `${hr}:${min}:${sec}`;
    if (time_frame > 86400000) return `${month}/${day} ${final_label}`;
  } else if (interval <= 24 * 60 * 60 * 1000) {
    final_label = `${hr}:${min}`;
    if (time_frame > 86400000) return `${month}/${day} ${final_label}`;
  } else if (interval <= 4 * 24 * 60 * 60 * 1000) {
    final_label = `${month}/${day} ${hr}:${min}`;
  } else if (interval <= 365 * 24 * 60 * 60 * 1000) {
    final_label = `${month}/${day}`;
  } else {
    final_label = `${year}-${month}`;
  }
  return final_label;
};

export const zoomInChart = (
  right,
  left,
  setRefLeft,
  setZoomed,
  setLeft,
  setRight,
  setTicks,
  ticks = null,
  padding_value = 0,
  min_interval = 0
) => {
  if (left === right || right === "") {
    setRefLeft("");
    return;
  }
  setZoomed(true);
  if (left > right) {
    if (left - right >= min_interval) {
      setLeft(right - padding_value);
      setRight(left + padding_value);
      if (ticks !== null) {
        setTicks(ticks.filter((tick) => tick >= right && tick <= left));
      }
    }
  } else {
    if (right - left >= min_interval) {
      setLeft(left - padding_value);
      setRight(right + padding_value);
      if (ticks !== null) {
        setTicks(ticks.filter((tick) => tick >= left && tick <= right));
      }
    }
  }
  setRefLeft("");
};

export const set_domain_min = (dataMin) => {
  if (dataMin >= 0) {
    return 0;
  } else {
    if (dataMin > -1) {
      return -1;
    } else if (dataMin === -1) {
      return -2;
    } else if (dataMin >= -5) {
      return -5;
    } else if (dataMin >= -10) {
      return -10;
    } else if (dataMin >= -100) {
      return -100;
    } else if (dataMin >= -1000) {
      return -1000;
    } else {
      return -Math.ceil(-dataMin / 1000) * 1000;
    }
  }
};

export const set_domain_max = (dataMax) => {
  if (dataMax >= 0) {
    if (dataMax < 1) {
      return 1;
    } else if (dataMax === 1) {
      return 2;
    } else if (dataMax <= 5) {
      return 5;
    } else if (dataMax <= 10) {
      return 10;
    } else if (dataMax <= 100) {
      return 100;
    } else if (dataMax <= 1000) {
      return 1000;
    } else {
      return Math.ceil(dataMax / 1000) * 1000;
    }
  } else {
    return 0;
  }
};

export const set_stat_domain = ([dataMin, dataMax]) => {
  if (dataMin === 0 && dataMax === 0) {
    return [0, 2];
  }
  let max = Math.max(Math.abs(dataMin), Math.abs(dataMax)) * 3;
  if (dataMin < 0) {
    return [dataMin, max];
  } else {
    return [0, max];
  }
};

export const calculateStat = (data, calculation) => {
  // console.log("🚀 ~ file: helper.js:152 ~ calculateStat ~ data:", data);
  let result;

  try {
    switch (calculation) {
      case "mean":
        result = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2);
        break;
      case "first":
        result = data[0];
        break;
      case "last":
        result = data[data.length - 1];
        break;
      case "min":
        result = Math.min(...data);
        break;
      case "max":
        result = Math.max(...data);
        break;
      case "total":
        result = data.reduce((a, b) => a + b, 0);
        break;
      case "count":
        result = data.length;
        break;
      default:
        result = "N/A";
        break;
    }
  } catch {
    result = "N/A";
    console.log("Stat calculation error");
  }
  return String(result);
};

export const getStatColor = (
  stat_value,
  setThreshold,
  baseColor,
  colorMode,
  all_threshold
) => {
  const color_switcher = (color) => {
    let backgroundColor = "rgb(33, 33, 33)";
    let textColor = "rgb(255, 255, 255)";
    let areaStroke = "rgb(80, 80, 80)";
    let areaColor = "rgb(60, 60, 60)";
    switch (color) {
      // case "gray":
      case "red":
        if (colorMode === "background") {
          backgroundColor = "rgb(255, 45, 100)";
          areaStroke = "rgb(255, 230, 230)";
          areaColor = "rgb(255, 150, 180)";
        } else if (colorMode === "value") {
          textColor = "rgb(255, 45, 100)";
          areaStroke = "rgb(255, 45, 100)";
          areaColor = "rgb(255, 45, 100)";
        } else if (colorMode === "none") {
          areaStroke = "rgb(255, 45, 100)";
          areaColor = "rgb(255, 45, 100)";
        }
        break;

      case "green":
        if (colorMode === "background") {
          backgroundColor = "rgb(55, 191, 93)";
          areaStroke = "rgb(231, 255, 238)";
          areaColor = "rgb(154, 236, 177)";
        } else if (colorMode === "value") {
          textColor = "rgb(55, 191, 93)";
          areaStroke = "rgb(55, 191, 93)";
          areaColor = "rgb(55, 191, 93)";
        } else if (colorMode === "none") {
          areaStroke = "rgb(55, 191, 93)";
          areaColor = "rgb(55, 191, 93)";
        }
        break;

      case "yellow":
        if (colorMode === "background") {
          backgroundColor = "rgb(240, 146, 34)";
          areaStroke = "rgb(255, 234, 210)";
          areaColor = "rgb(255, 190, 113)";
        } else if (colorMode === "value") {
          textColor = "rgb(240, 146, 34)";
          areaStroke = "rgb(240, 146, 34)";
          areaColor = "rgb(240, 146, 34)";
        } else if (colorMode === "none") {
          areaStroke = "rgb(240, 146, 34)";
          areaColor = "rgb(240, 146, 34)";
        }
        break;

      default:
        break;
    }
    return { backgroundColor, textColor, areaStroke, areaColor };
  };

  let color = baseColor;

  if (setThreshold) {
    const threshold = Object.entries(all_threshold)
      .filter(([key, value]) => value !== null)
      .sort(([, a], [, b]) => a - b);

    if (threshold.length > 0) {
      for (let i = 0; i < threshold.length; i++) {
        if (stat_value <= threshold[i][1]) {
          color = threshold[i][0];
          break;
        }
      }
    }
    return color_switcher(color);
  }
  return color_switcher(color);
};
