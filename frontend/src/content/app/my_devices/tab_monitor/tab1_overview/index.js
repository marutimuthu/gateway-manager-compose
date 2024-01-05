import {
  Card,
  Box,
  Grid,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  TextField,
  OutlinedInput,
  InputAdornment,
  useTheme,
  Button,
  LinearProgress
} from '@mui/material';

import moment from 'moment';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import StatisticsCard from './card';
import RepresentData from '../tab2_activity/tabbed_graphs';

import SignalWifi4BarLockIcon from '@mui/icons-material/SignalWifi4BarLock';
import FourGMobiledataIcon from '@mui/icons-material/FourGMobiledata';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import RouterIcon from '@mui/icons-material/Router';
import ShieldIcon from '@mui/icons-material/Shield';
import { useLocation } from 'react-router';
import axios from 'axios';

import { server_url } from 'src/api/app.js';

function Statistics() {
  const [device, setDevice] = useState([]);

  // In future we have to store userId in redux
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const mac_id = location.pathname.split('/');

  const [loading, setLoading] = useState(false);
  // console.log(mac_id[3])

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        // `http://54.202.17.198:8080/api/device/${userInfo.id}`
        `${server_url}/api/device/find/${mac_id[3]}`
      )
      .then((response) => {
        // console.log('DEBUG zone response', response);
        // console.log(response.data[0]);
        setDevice(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  function enable_disable(params) {
    
    if (params == 1) {
      return 'Enabled';
    } else if (params == 0) {
      return 'Disabled';
    }
  }

  // Function to check if a year has elapsed
  function hasYearElapsed(startDate) {
    // Get the current date as a Moment.js object
    const currentMoment = moment();

    // Calculate the difference in years between the start date and the current date
    const yearsElapsed = currentMoment.diff(startDate, 'years');

    // Check if at least one year has elapsed
    return yearsElapsed >= 1;
  }

  // Function to add a year
  function addYear() {
    // add a year
    let startDate = moment
      .utc(device.createdAt)
      .add(1, 'y')
      .local()
      .format('hh:mm:ss A DD-MMM-YY');

    return startDate;
  }

  return (
    <Box >
      {loading ? <LinearProgress sx={{ m: 2 }} /> : false}
      <Grid container row-gap={1} spacing={3} flexWrap="wrap">
        {/* color: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | string */}
        <StatisticsCard
          icon={<RouterIcon sx={{ m: 1 }} fontSize="large" color="primary" />}
          gateway_type={device.gateway_type}
          label={'Device'}
          heading1_key={'Name'}
          heading1_value={device.name}
          // heading3_key={'Hardware'}
          // heading3_value={device.hardware}
          heading2_key={'FW Ver.'}
          heading2_value={device.firmware_version}
          // heading4_key={'MAC ID'}
          // heading4_value={device.mac_id}
          heading5_key={'RTC'}
          heading5_value={enable_disable(device.rtc_status)}
          heading6_key={'Data Route'}
          heading6_value={(device.mode_routes == 0) ? 'MQTT' : (device.mode_routes == 1) ? 'HTTP' : (device.mode_routes == 2) ? 'MQTTS' : 'HTTPS'}
          // heading6_key={'Module'}
          // heading6_value={device.module}
          heading7_key={'Scheduled Restart'}
          heading7_value={enable_disable(device.schedule_restart_enable)}
          heading8_key={'Scheduled Restart Time (Daily)'}
          heading8_value={`${device.schedule_restart_hour}:${device.schedule_restart_minute}:${device.schedule_restart_second}`}
        />

        

        <StatisticsCard
          icon={
            <SignalWifi4BarLockIcon
              sx={{ m: 1 }}
              fontSize="large"
              color="primary"
            />
          }
          label={'WiFi'}
          chip1_key={'Status'}
          chip1_value={enable_disable(device.wifi_status)}
          heading2_key={'SSID'}
          heading2_value={device.wifi_ssid}
          heading3_key={'RSSI'}
          heading3_value={device.wifi_rssi}
          heading4_key={'DHCP'}
          heading4_value={enable_disable(device.dhcp)}
          heading5_key={'IP'}
          heading5_value={device.ip}
          heading6_key={'Gateway'}
          heading6_value={device.gateway}
          heading7_key={'Subnet'}
          heading7_value={device.subnet}
          heading8_key={'DNS1'}
          heading8_value={device.dns1}
          heading9_key={'DNS2'}
          heading9_value={device.dns2}
          heading10_key={(device.mode_routes == 0 || device.mode_routes == 2) ? 'Broker Status' : 'Server Status'}
          heading10_value = {(device.mode_routes == 0 || device.mode_routes == 2) ? enable_disable(device.mqtt_status) : enable_disable(device.http_status)}
          heading11_key={(device.mode_routes == 0 || device.mode_routes == 2) ? 'Broker URL': 'Server URL'}
          heading11_value={(device.mode_routes == 0 || device.mode_routes == 2) ? device.mqtt_url : device.https_api}
          // heading11_key={'Broker Username'}
          // heading11_value={device.mqtt_user}
          // heading12_key={'Broker Password'}
          // heading12_value={device.mqtt_pass}
        />

        <StatisticsCard
          icon={
            <SettingsEthernetIcon
              sx={{ m: 1 }}
              fontSize="large"
              color="primary"
            />
          }
          label={'Ethernet'}
          chip1_key={'Status'}
          chip1_value={enable_disable(device.eth_status)}
          heading2_key={'DHCP'}
          heading2_value={enable_disable(device.dhcp)}
          heading3_key={'IP'}
          heading3_value={device.ip}
          heading4_key={'Gateway'}
          heading4_value={device.gateway}
          heading5_key={'Subnet'}
          heading5_value={device.subnet}
          heading6_key={'DNS1'}
          heading6_value={device.dns1}
          heading7_key={'DNS2'}
          heading7_value={device.dns2}
          heading8_key={(device.mode_routes == 0 || device.mode_routes == 2) ? 'Broker Status' : 'Server Status'}
          heading8_value = {(device.mode_routes == 0 || device.mode_routes == 2) ? enable_disable(device.mqtt_status) : enable_disable(device.http_status)}
          heading9_key={(device.mode_routes == 0 || device.mode_routes == 2) ? 'Broker URL': 'Server URL'}
          heading9_value={(device.mode_routes == 0 || device.mode_routes == 2) ? device.mqtt_url : device.https_api}
          // heading10_key={'Broker Username'}
          // heading10_value={device.mqtt_user}
          // heading11_key={'Broker Password'}
          // heading11_value={device.mqtt_pass}
        />

        <StatisticsCard
          icon={
            <FourGMobiledataIcon
              sx={{ m: 1 }}
              fontSize="large"
              color="primary"
            />
          }
          label={'4G'}
          // chip1_key={'LTE Mode'}
          // chip1_value={enable_disable(device.lte_mode)}
          chip1_key={'Status'}
          chip1_value={enable_disable(device.lte_status)}
          heading3_key={'Network Provider'}
          heading3_value={device.lte_operator}
          heading4_key={'RSSI'}
          heading4_value={device.lte_rssi}
          heading5_key={'4G IP'}
          heading5_value={device.lte_ip}
          heading6_key={(device.mode_routes == 0 || device.mode_routes == 2) ? 'Broker Status' : 'Server Status'}
          heading6_value = {(device.mode_routes == 0 || device.mode_routes == 2) ? enable_disable(device.mqtt_status) : enable_disable(device.http_status)}
          heading7_key={(device.mode_routes == 0 || device.mode_routes == 2) ? 'Broker URL': 'Server URL'}
          heading7_value={(device.mode_routes == 0 || device.mode_routes == 2) ? device.mqtt_url : device.https_api}
          // heading7_key={'Broker Username'}
          // heading7_value={device.mqtt_lte_user}
          // heading8_key={'Broker Password'}
          // heading8_value={device.mqtt_lte_pass}
          // heading9_key={'-'}
          // heading9_value={' '}
          // heading10_key={'-'}
          // heading10_value={' '}
        />

        <StatisticsCard
          icon={<ShieldIcon sx={{ m: 1 }} fontSize="large" color="primary" />}
          label={'Warranty Status'}
          chip1_key={'Status'}
          chip1_value={
            hasYearElapsed(
              moment
                .utc(device.createdAt)
                .local()
                .format('hh:mm:ss A DD-MMM-YY')
            )
              ? 'Expired. (Renew)'
              : 'Covered'
          }
          heading2_key={'Warranty Period'}
          heading2_value={'1 year'}
          heading3_key={'Registered On'}
          heading3_value={moment
            .utc(device.createdAt)
            .local()
            .format('hh:mm:ss A DD-MMM-YY')}
          heading4_key={'Warranty Validity Upto'}
          heading4_value={addYear()}
          heading5_key={'-'}
          heading5_value={' '}
          heading6_key={'-'}
          heading6_value={' '}
        />

      </Grid>
    </Box>
  );
}

export default Statistics;
