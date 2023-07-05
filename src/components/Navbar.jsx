import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addWidget,
  store,
  loadUploadData,
  loadUploadVariable,
  loadUploadDashboardName,
  setChartOption,
  clearChartData,
  clearChartSetting,
  clearAreaSetting,
  clearBarSetting,
  clearComposeSetting,
  clearPieSetting,
  clearLineSetting,
  clearTimeSeriesSetting,
  clearStatSetting,
} from "../store";
import ChooseDashboard from "./ChooseDashboard";
import axios from "axios";

// // Get cookies name
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

// create file name func
const createFileName = () => {
  // file name time
  let currentYear = new Date().getFullYear().toString();
  let currentMonth = (new Date().getMonth() + 1).toString();
  let currentDate = new Date().getDate().toString();
  let currentHour = new Date().getHours().toString();
  let currentMin = new Date().getMinutes().toString();
  let currentSec = new Date().getSeconds().toString();

  if (currentMonth < 10) {
    currentMonth = "0" + currentMonth;
  }
  if (currentDate < 10) {
    currentDate = "0" + currentDate;
  }
  if (currentHour < 10) {
    currentHour = "0" + currentHour;
  }
  if (currentMin < 10) {
    currentMin = "0" + currentMin;
  }
  if (currentSec < 10) {
    currentSec = "0" + currentSec;
  }
  let currentTimeString =
    currentYear +
    currentMonth +
    currentDate +
    "_" +
    currentHour +
    currentMin +
    currentSec;

  return currentTimeString;
};

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const dashboardName = useSelector((state) => state.widget.dashboardName);
  const [selectDashboard, setSelectDashboard] = useState(false);
  // const Icons = styled(Box)(({ theme }) => ({
  //   backgroundColor: "yellow",
  // }));

  const { chartData, chartSetting } = useSelector((state) => {
    const chartType = state.chartData.value.chartType;

    let chartStyleSetting = {};
    let chartOtherSetting = {};
    switch (chartType) {
      case "Bar Chart":
        chartStyleSetting = state.barSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Line Chart":
        chartStyleSetting = state.lineSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Area Chart":
        chartStyleSetting = state.areaSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Pie Chart":
        chartStyleSetting = state.pieSetting.value;
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Compose Chart":
        chartStyleSetting = {
          keys: state.composeSetting.value,
          BarSetting: state.barSetting.value,
          LineSetting: state.lineSetting.value,
          AreaSetting: state.areaSetting.value,
        };
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Time Series":
        chartStyleSetting = {
          setting: state.timeSeriesSetting.value,
          BarSetting: state.barSetting.value,
          LineSetting: state.lineSetting.value,
          AreaSetting: state.areaSetting.value,
        };
        chartOtherSetting = state.chartSetting.value.Recharts;
        break;
      case "Stat":
        chartStyleSetting = state.statSetting.value;
        chartOtherSetting = {};
        break;

      default:
        break;
    }

    return {
      chartData: state.chartData.value,
      chartSetting: {
        style: chartStyleSetting,
        other: chartOtherSetting,
        keysColor: state.chartData.value.keysColor,
      },
    };
  });

  const saveChartSetting = () => {
    const curr_page = pathname.split("/").slice(-2);
    if (curr_page[1] === "edit") {
      dispatch(
        setChartOption({
          panelId: curr_page[0],
          chartOption: {
            chartType: chartData.chartType,
            setting: chartSetting,
            x_key: chartData.xKey,
            y_key: chartData.yKey,
          },
        })
      );
      dispatch(clearChartData());
      dispatch(clearChartSetting());
      dispatch(clearAreaSetting());
      dispatch(clearBarSetting());
      dispatch(clearLineSetting());
      dispatch(clearComposeSetting());
      dispatch(clearPieSetting());
      dispatch(clearTimeSeriesSetting());
      dispatch(clearStatSetting());
    }
  };

  const handleAddPanel = () => {
    dispatch(addWidget());
  };

  const handleDownloadPanel = () => {
    const data = store.getState();
    console.log("yooooooooooooooo~", store.getState());
    // // file name time
    // let currentYear = new Date().getFullYear().toString();
    // let currentMonth = (new Date().getMonth() + 1).toString();
    // let currentDate = new Date().getDate().toString();
    // let currentHour = new Date().getHours().toString();
    // let currentMin = new Date().getMinutes().toString();
    // let currentSec = new Date().getSeconds().toString();

    // if (currentMonth < 10) {
    //   currentMonth = "0" + currentMonth;
    // }
    // if (currentDate < 10) {
    //   currentDate = "0" + currentDate;
    // }
    // if (currentHour < 10) {
    //   currentHour = "0" + currentHour;
    // }
    // if (currentMin < 10) {
    //   currentMin = "0" + currentMin;
    // }
    // if (currentSec < 10) {
    //   currentSec = "0" + currentSec;
    // }
    // let currentTimeString =
    //   currentYear +
    //   currentMonth +
    //   currentDate +
    //   "_" +
    //   currentHour +
    //   currentMin +
    //   currentSec;
    let timeForFile = createFileName();

    // create file in browser
    const fileName = `${timeForFile}_DashboardConfig`;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleUploadPanel = (e) => {
    console.log(e.target.files);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      console.log("e.target.result", e.target.result);
      const fileData = JSON.parse(e.target.result);
      const widgetArray = fileData?.widget?.widgetArray;
      const variableArray = fileData?.variable?.variableArray;
      const dashboardName = fileData?.widget?.dashboardName;
      console.log(fileData);

      dispatch(loadUploadData({ widgetArray }));
      dispatch(loadUploadVariable({ variableArray }));
      dispatch(loadUploadDashboardName({ dashboardName }));
    };
    if (fileReader.readyState === 2) {
      fileReader.abort();
    }
  };

  const handleOpenSelectDashboard = () => {
    setSelectDashboard(true);
  };

  const [editURL, setEditURL] = useState("");
  // console.log("file: Navbar.jsx:105 ~ ButtonAppBar ~ editURL:", editURL);

  const handleSaveDashboard = async () => {
    try {
      const config = {
        method: "post",
        headers: {
          Accept: "application/json",
          "X-CSRFTOKEN": `${getCookie("csrftoken")}`,
          "Content-Type": "application/json",
        },
      };
      let fileNameTime = createFileName() + "_" + dashboardName;
      const dashboardData = await store.getState();
      const res = await axios.post(
        `/v2/dashboard_config/?product=Demo_No1&name=${fileNameTime}`,
        {
          data: dashboardData,
        },
        config
      );

      console.log("file: Navbar.jsx:227 ~ handleSaveDashboard ~ res:", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar variant="dense">
          {pathname !== "/" ? (
            <Tooltip title="Back">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => {
                  if ([pathname.includes("settings")]) {
                    navigate(editURL);
                    setEditURL("");
                  } else {
                    navigate("/");
                  }
                  saveChartSetting();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
            {pathname === "/settings" ? (
              `${dashboardName} / Settings`
            ) : pathname === "/" ? (
              <>
                <GridViewIcon sx={{ marginRight: "0.5rem" }} />
                {`${dashboardName}`}
              </>
            ) : (
              `${dashboardName} / Edit Panel`
            )}
          </Typography>
          {/* <Button color="inherit">
      
            Add Panel
          </Button> */}
          {pathname === "/" ? (
            <Tooltip title="Add Panel">
              <IconButton onClick={handleAddPanel}>
                <DashboardCustomizeIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          {pathname === "/" ? (
            <Tooltip title="Download Panel">
              <IconButton onClick={handleDownloadPanel}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          {pathname === "/" ? (
            <Tooltip title="Upload Panel">
              <IconButton component="label">
                <FileUploadIcon />
                <input
                  id="uploadFileID"
                  hidden
                  accept=".json"
                  type="file"
                  onChange={handleUploadPanel}
                />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          {pathname === "/" ? (
            <Tooltip title="Save Dashboard">
              <IconButton onClick={handleSaveDashboard}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}

          {pathname === "/" ? <Button color="inherit">Time</Button> : ""}
          {pathname === "/" ? (
            <Tooltip title="Select Dashboard">
              <IconButton onClick={handleOpenSelectDashboard}>
                <DashboardIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          {pathname !== "/" ? (
            <Tooltip title="Save Panel">
              <IconButton
                onClick={() => {
                  navigate("/");
                  saveChartSetting();
                }}
              >
                <SaveAltIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          <Tooltip title="Settings">
            <IconButton
              onClick={() => {
                setEditURL(pathname);
                navigate("/settings");
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <ChooseDashboard
          setSelectDashboard={setSelectDashboard}
          selectDashboard={selectDashboard}
        />
      </AppBar>
    </Box>
  );
}
