import { Box, Button } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStreamingOption } from "../../store";

const StreamingOption = ({ panelID }) => {
  const dispatch = useDispatch();
  const { streamingOptionFromRedux } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    return {
      streamingOptionFromRedux: targetPanel[0].streamingOption,
    };
  });

  const [streamingOption, setStreamingOption] = useState(
    streamingOptionFromRedux
  );
  // from redux
  useEffect(() => {
    dispatch(
      changeStreamingOption({
        panelID,
        streamingOption,
      })
    );
  }, [streamingOption]);

  return (
    <Box display="flex">
      <Button
        variant={streamingOption === "Collect" ? "contained" : "outlined"}
        color="primary"
        m={2}
        sx={{ marginTop: "2rem" }}
        onClick={() => {
          setStreamingOption("Collect");
        }}
      >
        collect
      </Button>
      <Button
        variant={streamingOption === "Overwrite" ? "contained" : "outlined"}
        color="primary"
        m={2}
        sx={{ marginTop: "2rem" }}
        onClick={() => {
          setStreamingOption("Overwrite");
        }}
      >
        overwrite
      </Button>
    </Box>
  );
};

export default StreamingOption;
