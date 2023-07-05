import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import GraphBolck from "../GraphBolck";
import DataSourceBlock from "./DataSourceBlock";
import { BsDatabase } from "react-icons/bs";
import { TbTransform } from "react-icons/tb";
import { useState } from "react";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TransformBlock from "./TransformBlock";
import StreamingSourceBlock from "./StreamingSourceBlock";
import { useDispatch, useSelector } from "react-redux";
import { changeTypeOfData } from "../../store";
import StreamingOption from "./StreamingOption";
import StaticTimeSelector from "./StaticTimeSelector";

const StaticStreamingSwitcher = ({ setTypeOfData, typeOfData }) => {
  return (
    <Box display="flex">
      <Button
        variant={typeOfData === "Static" ? "contained" : "outlined"}
        color="secondary"
        m={2}
        sx={{ marginTop: "2rem" }}
        onClick={() => {
          setTypeOfData("Static");
        }}
      >
        Static
      </Button>
      <Button
        variant={typeOfData === "Streaming" ? "contained" : "outlined"}
        color="secondary"
        m={2}
        sx={{ marginTop: "2rem" }}
        onClick={() => {
          setTypeOfData("Streaming");
        }}
      >
        Streaming
      </Button>
    </Box>
  );
};

const Leftbar = ({ panelID }) => {
  const [sizes, setSizes] = useState([400]);

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const dispatch = useDispatch();

  const { typeOfDataFromRedux, firstPanelURl } = useSelector((state) => {
    const panelArray = state.widget.widgetArray;
    const targetPanel = panelArray.filter((panel) => panel.i === panelID);
    return {
      typeOfDataFromRedux: targetPanel[0].typeOfData,
      firstPanelURl: targetPanel[0].data[0].datasource_url,
    };
  });

  const [typeOfData, setTypeOfData] = useState(typeOfDataFromRedux);

  useEffect(() => {
    dispatch(
      changeTypeOfData({
        panelID,
        typeOfData,
      })
    );
  }, [typeOfData]);

  const [warningMsg, setWarningMsg] = useState(
    "Websocket will close temporarily"
  );

  useEffect(() => {
    let showMsg;
    if (typeOfData === "Streaming" && tabIndex === 0) {
      setWarningMsg("Websocket will close temporarily");
    }
    if (typeOfData === "Streaming" && tabIndex === 1) {
      showMsg = setTimeout(() => {
        setWarningMsg("");
      }, 5000);
    }
    return () => clearTimeout(showMsg);
  }, [tabIndex]);

  return (
    <Box
      display="flex"
      style={{ height: "calc(100vh - 100px)" }}
      flexDirection="column"
    >
      <Box
        component="div"
        className="demo-wrap"
        bgcolor={`rgba(0,0,0,0.2 )`}
        flex={1}
        color={"text.primary"}
        overflow="hidden"
        //sx={{ marginBottom: 0 }}
      >
        <SplitPane
          split="horizontal"
          sizes={sizes}
          onChange={setSizes}
          sashRender={(index, active) => (
            <SashContent className="action-sash-wrap">
              <span className="action">
                {sizes[0] !== 0 ? (
                  <ExpandLessIcon />
                ) : (
                  // <div style={{ transform: `rotate(180deg)` }}>^</div>
                  <ExpandMoreIcon />
                )}
              </span>
            </SashContent>
          )}
        >
          <Pane
            maxSize="100%"
            style={{ overflowY: "auto", scrollPadding: "20px" }}
          >
            <GraphBolck panelID={panelID} />
          </Pane>
          <Pane
            style={{ overflowY: "auto", scrollPadding: "20px" }}
            minSize="0%"
          >
            <Box
              sx={{
                marginTop: "1rem",
                "& .MuiTabs-scroller": {
                  height: "50px",
                },
                "& .MuiTabs-indecator": {
                  color: "orange",
                },

                "& .MuiButtonBase-root.tabSwitcher": {
                  textTransform: "none",
                  color: "#92806E",
                  padding: "0 9px",
                },
                "& .MuiTabs-flexContainer": {
                  height: "30px",
                },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                className="tabSwitcher"
                TabIndicatorProps={{
                  style: {
                    background:
                      "linear-gradient(90deg, rgba(254,133,51,1) 0%, rgba(245,96,61,1) 70%)",
                    height: "3px",
                  },
                }}
                sx={{
                  "& .Mui-selected": {
                    color: "white !important",
                  },
                }}
              >
                <Tab
                  icon={<BsDatabase />}
                  iconPosition="start"
                  className="tabSwitcher"
                  label="Query"
                  sx={{
                    color: "white",
                  }}
                />
                <Tab
                  label="Transform"
                  icon={<TbTransform />}
                  className="tabSwitcher"
                  iconPosition="start"
                  sx={{ color: "white" }}
                />
              </Tabs>
              {typeOfData === "Streaming" &&
                tabIndex === 1 &&
                firstPanelURl !== null && (
                  <Box>
                    <Typography color="red">{warningMsg}</Typography>
                  </Box>
                )}
              {typeOfData === "Streaming" && tabIndex === 0 && (
                <StreamingOption panelID={panelID} />
              )}

              {typeOfData === "Static" && tabIndex === 0 && (
                <StaticTimeSelector panelID={panelID} />
              )}

              {tabIndex === 0 && (
                <StaticStreamingSwitcher
                  setTypeOfData={setTypeOfData}
                  typeOfData={typeOfData}
                />
              )}
            </Box>

            <Box>
              {tabIndex === 0 && (
                <DataSourceBlock panelID={panelID} typeofData={typeOfData} />
              )}
            </Box>

            <Box>{tabIndex === 1 && <TransformBlock panelID={panelID} />}</Box>
          </Pane>
        </SplitPane>
      </Box>
    </Box>
  );
};

export default Leftbar;
