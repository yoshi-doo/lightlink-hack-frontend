import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { AppBar } from "@mui/material";
import EventGrid from "./EventGrid";
import MyTicketsGrid from "./MyTicketsGrid";
import MyEventGrid from "./MyEventsGrid";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FeatureTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", paddingTop: "15px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <AppBar position="static" sx={{ background: "#84309c" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#309c59",
              },
            }}
            centered
          >
            <Tab label="New Events" />
            <Tab label="My Tickets" />
            <Tab label="My Events" />
          </Tabs>
        </AppBar>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <EventGrid />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MyTicketsGrid />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MyEventGrid />
      </CustomTabPanel>
    </Box>
  );
};

export default FeatureTabs;
