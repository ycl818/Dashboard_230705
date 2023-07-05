import React, { useEffect } from "react";
import AlarmIcon from "@mui/icons-material/Alarm";
import { Box, IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStaticQueryInterval } from "../../store/slice/widgetSlice";

const StaticTimeSelector = ({ panelID }) => {
  const { staticQueryIntervalFromRedux } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    return {
      staticQueryIntervalFromRedux: targetPanel[0].staticQueryInterval,
    };
  });
  const [time, setTime] = useState(staticQueryIntervalFromRedux);
  const dispatch = useDispatch();
  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  useEffect(() => {
    dispatch(
      changeStaticQueryInterval({
        panelID,
        staticQueryInterval: time,
      })
    );
  }, [time]);

  return (
    <Box sx={{ marginTop: "2rem" }}>
      <Tooltip title="Query Interval">
        <IconButton color="secondary" aria-label="add an alarm">
          <AlarmIcon />
        </IconButton>
      </Tooltip>
      <Select
        sx={{
          "& .MuiSelect-select": {
            p: "5px 5px 5px 10px",
          },
        }}
        value={time}
        onChange={handleTimeChange}
      >
        <MenuItem value={0}>Off</MenuItem>
        <MenuItem value={5}>5s</MenuItem>
        <MenuItem value={10}>10s</MenuItem>
        <MenuItem value={30}>30s</MenuItem>
        <MenuItem value={60}>1m</MenuItem>
        <MenuItem value={300}>5m</MenuItem>
        <MenuItem value={900}>15m</MenuItem>
        <MenuItem value={1800}>30m</MenuItem>
        <MenuItem value={3600}>1h</MenuItem>
        <MenuItem value={7200}>2h</MenuItem>
        <MenuItem value={86400}>1d</MenuItem>
      </Select>
    </Box>
  );
};

export default StaticTimeSelector;
