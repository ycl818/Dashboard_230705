import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cleanUpAllPanel, loadUploadData, loadUploadVariable } from "../store";
import DeleteIcon from "@mui/icons-material/Delete";
import { HiOutlinePencilAlt } from "react-icons/hi";
import DivideLine from "./EditComponents/DataSourceComponent/DataSourceUI/DivideLine";
import axios from "axios";

const ChooseDashboard = ({ selectDashboard, setSelectDashboard }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    setSelectDashboard(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  // config list
  const [configData, setConfigData] = useState([]);
  // console.log(
  //   "🚀 ~ file: ChooseDashboard.jsx:164 ~ ChooseDashboard ~ configData:",
  //   configData
  // );
  const getDashboardConfigs = async () => {
    try {
      const res = await axios.get("v2/dashboard_config/?product=Demo_No1");
      if (res.data.status === "success") {
        setConfigData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectDashboard) {
      getDashboardConfigs();
    }
  }, [selectDashboard]);

  const data1 = [];
  const data2 = [];

  const handleOnclick = (name) => {
    console.log("file: ChooseDashboard.jsx:1304 ~ handleOnclick ~ name:", name);

    if (name === "20230419_114006_DashboardConfig.josn") {
      const widgetArray = data1.widget?.widgetArray;
      const variableArray = data1.variable?.variableArray;

      dispatch(cleanUpAllPanel());

      dispatch(loadUploadData({ widgetArray }));
      dispatch(loadUploadVariable({ variableArray }));
    } else if (name === "20230419_100048_DashboardConfig.json") {
      const widgetArray = data2.widget?.widgetArray;
      const variableArray = data2.variable?.variableArray;

      dispatch(cleanUpAllPanel());
      dispatch(loadUploadData({ widgetArray }));
      dispatch(loadUploadVariable({ variableArray }));
    }

    handleClose();
  };

  const handleDelete = async (name) => {
    try {
      const res = await axios.delete(
        `v2/dashboard_config/?product=Demo_No1&name=${name}`
      );
      if (res.data.status === "success") {
        getDashboardConfigs();
      }
    } catch (error) {
      console.log(error);
    }
    setSelectDashboard(true);
  };

  return (
    <Dialog open={selectDashboard} onClose={handleClose}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Select Dashboard Config
        <CloseIcon
          onClick={handleClose}
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Select the one of the following dashboard configurations
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <List>
            {configData?.map((listElement) => (
              <>
                <ListItem
                  key={listElement.fileName}
                  onClick={() => {
                    // handleOnclick(listElement.fileName);
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText>{listElement}</ListItemText>
                  </ListItemButton>
                  <Tooltip title="Rename Config">
                    <IconButton color="primary">
                      <HiOutlinePencilAlt />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Config">
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        handleDelete(listElement);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <DivideLine />
              </>
            ))}
            {!configData.length && (
              <ListItem sx={{ textAlign: "center" }}>
                <ListItemText sx={{ marginRight: "8rem" }}>
                  No Config history
                </ListItemText>
              </ListItem>
            )}
          </List>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChooseDashboard;
