// import PageTitle from '../../../../components/PageTitleCard';
// import PageTitleWrapper from '../../../../components/PageTitleWrapperCard';

import {
  Stack,
  Button,
  Grid,
  Card,
  Select,
  MenuItem,
  CardContent,
  Divider,
  Typography,
  LinearProgress
} from '@mui/material';
import Footer from 'src/components/Footer';
import moment from 'moment';

import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/Upload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import './App.css';
import { server_url } from 'src/api/app.js';

import JSONPretty from 'react-json-pretty';

var query_offset = 0;

const network_mode = [
  {
    value: '0',
    label: 'Disable'
  },
  {
    value: '1',
    label: 'WiFi'
  },
  {
    value: '2',
    label: 'Ethernet'
  },
  {
    value: '3',
    label: '4G'
  }
];

const dhcp_mode = [
  {
    value: 0,
    label: 'Static'
  },
  {
    value: 1,
    label: 'Dynamic'
  }
];

const data_routes_mode = [
  {
    value: 0,
    label: 'MQTT'
  },
  {
    value: 1,
    label: 'HTTP'
  },
  {
    value: 2,
    label: 'MQTTS'
  },
  {
    value: 3,
    label: 'HTTPS'
  }
];

const input1_mode = [
  {
    value: 0,
    label: 'Disable'
  },
  {
    value: 1,
    label: 'Counter'
  },
  {
    value: 2,
    label: '4-20mA'
  },
  {
    value: 3,
    label: 'NTC'
  }
];

const input2_mode = [
  {
    value: 0,
    label: 'Disable'
  },
  {
    value: 1,
    label: 'Counter'
  },
  {
    value: 2,
    label: '4-20mA'
  },
  {
    value: 3,
    label: 'NTC'
  }
];

const modbus_mode = [
  {
    value: '0',
    label: 'Disable'
  },
  {
    value: '1',
    label: 'RTU'
  },
  {
    value: '2',
    label: 'ASCII'
  },
  {
    value: '3',
    label: 'TCP IP'
  },
  {
    value: '4',
    label: 'RS232'
  }
];

// 4800, 9600, 14400, 19200, 38400, 57600, 115200
const modbus_baudrate = [
  {
    value: '4800',
    label: '4800'
  },
  {
    value: '9600',
    label: '9600'
  },
  {
    value: '14400',
    label: '14400'
  },
  {
    value: '19200',
    label: '19200'
  },
  {
    value: '38400',
    label: '38400'
  },
  {
    value: '57600',
    label: '57600'
  },
  {
    value: '115200',
    label: '115200'
  }
];

const modbus_parity = [
  {
    value: '0',
    label: 'Disable'
  },
  {
    value: '1',
    label: 'Even'
  },
  {
    value: '2',
    label: 'Odd'
  }
];

const modbus_stop_bits = [
  {
    value: '1',
    label: '1'
  },
  {
    value: '1_5',
    label: '1.5'
  },
  {
    value: '2',
    label: '2'
  }
];

const schedule_restart_mode = [
  {
    value: '0',
    label: 'Disabled'
  },
  {
    value: '1',
    label: 'Enabled'
  }
];

function validate_mb_query(query){
  try{
    var valid_query = true;
    var query = JSON.parse(query);

    query.forEach(element => {
      if(element.length != 6){
        valid_query = false;
      }
    });

    if(valid_query == true){
      return true;
    }
    else{
        return false;
    }
  }
  catch{
      console.log("invalid");
      return false;
  }
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function find_label(value, array) {
  if (value !== undefined && value !== '') {
    var find_ = array.find((obj) => obj.value == value);
    return find_.label;
  } else {
    return '-';
  }
}

const DeviceSettingsCard = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(0);
  const [severity, setSeverity] = useState(0);
  const [data_received, setData_received] = useState(false);
  const [query, setQuery] = useState('');
  const vertical = 'bottom';
  const horizontal = 'right';
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState([]);
  const [defaults, setDefaults] = useState({});
  const [inputs, setInputs] = useState({});
  const [modbus_offset, setModbus_offset] = useState(0);

  const [formErrors, setFormErrors] = useState({});

  const [certHTTPSerr, setCertHTTPSerr] = useState(false);
  const [certMQTTSerr, setCertMQTTSerr] = useState(false);
  const [certMQTTSCliCerterr, setCertMQTTSCliCerterr] = useState(false);
  const [certMQTTSCliKeyerr, setCertMQTTSCliKeyerr] = useState(false);

  const network_modeRef = useRef();
  const wifi_ssidRef = useRef();
  const wifi_passRef = useRef();
  const dhcpRef = useRef();
  const ipRef = useRef();
  const gatewayRef = useRef();
  const subnetRef = useRef();
  const dns1Ref = useRef();
  const dns2Ref = useRef();
  const lte_apnRef = useRef();

  // Remove
  const lte_modeRef = useRef();

  const mode_routesRef = useRef();
  const mqtt_clientidRef = useRef();
  const mqtt_urlRef = useRef();
  const mqtt_userRef = useRef();
  const mqtt_passRef = useRef();
  const mqtt_certRef = useRef();
  const https_certRef = useRef();
  const https_apiRef = useRef();
  const https_backup_apiRef = useRef();

  // Remove
  const mqtt_wifi_clientidRef = useRef();
  const mqtt_wifi_urlRef = useRef();
  const mqtt_wifi_userRef = useRef();
  const mqtt_wifi_passRef = useRef();
  const mqtt_lte_clientidRef = useRef();
  const mqtt_lte_urlRef = useRef();
  const mqtt_lte_userRef = useRef();
  const mqtt_lte_passRef = useRef();

  // Add
  const in_intervalRef = useRef();
  const in1_modeRef = useRef();
  const in1_slopeRef = useRef();
  const in1_offsetRef = useRef();
  const in2_modeRef = useRef();
  const in2_slopeRef = useRef();
  const in2_offsetRef = useRef();

  const mb_modeRef = useRef();
  const mb_intervalRef = useRef();
  const mb_timeoutRef = useRef();
  const mb_offsetRef = useRef();
  const baudRef = useRef();
  const data_bitsRef = useRef();
  const parityRef = useRef();
  const stop_bitsRef = useRef();
  const mb_ipRef = useRef();
  const mb_portRef = useRef();
  const mb_tcp_slaveidRef = useRef();
  const mb_queryRef = useRef();
  const mb_address_mapRef = useRef({});
  const en_custom_pubRef = useRef();
  const custom_pub_intervalRef = useRef();
  const custom_pub_data_ptsRef = useRef();

  const schedule_restart_enableRef = useRef();
  const schedule_restart_hourRef = useRef();
  const schedule_restart_minuteRef = useRef();
  const schedule_restart_secondRef = useRef();

  const openSnackbar = (message, severity) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
    // console.log(message,severity)
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const mac_id = location.pathname.split('/');
  // console.log(mac_id[3])

  const modbus_query_to_JSON = (str) => {
    var slave_id_arr = [];
    var function_code_arr = [];
    var final_return_json = [];

    query_offset = modbus_offset;

    if (str) {
      var query_array = JSON.parse(str);

      for (var i = 0; i < query_array.length; i++) {
        if (!slave_id_arr.includes(query_array[i][0])) {
          slave_id_arr.push(query_array[i][0]);
        }

        if (!function_code_arr.includes(query_array[i][1])) {
          function_code_arr.push(query_array[i][1]);
        }
      }

      for (
        var slave_index = 0;
        slave_index < slave_id_arr.length;
        slave_index++
      ) {
        for (
          var function_index = 0;
          function_index < function_code_arr.length;
          function_index++
        ) {
          var new_slave_id_arr = [];
          var return_json = {};

          for (var i = 0; i < query_array.length; i++) {
            var slave = query_array[i][0];
            var fcode = query_array[i][1];
            var starting_address = query_array[i][2];
            var no_of_data = query_array[i][3];
            var datatype = query_array[i][4];

            if (
              slave == slave_id_arr[slave_index] &&
              fcode == function_code_arr[function_index]
            ) {
              if (!new_slave_id_arr.includes(slave)) {
                new_slave_id_arr.push(slave);
                return_json.slave_id = slave_id_arr[slave_index];
                return_json.function_code = function_code_arr[function_index];
              }

              for (
                var data_count = starting_address;
                data_count < starting_address + no_of_data;
                data_count
              ) {
                if (datatype >= 0 && datatype <= 11 && fcode != 1 && fcode != 2) {
                  if(no_of_data % 2 == 0){
                    return_json['D' + (data_count + parseInt(query_offset))] = 0;
                  }
                  data_count += 2;
                } else {
                  return_json['D' + (data_count + parseInt(query_offset))] = 0;
                  data_count += 1;
                }
              }
            }
          }

          if (JSON.stringify(return_json) !== '{}') {
            final_return_json.push(return_json);
          }
        }
      }
      // console.log(final_return_json);
      return final_return_json;
    }
  };

  const validateValues = (valuez) => {
    let errors = {};
    const regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/i;

    if(valuez.network_mode < 0 || valuez.network_mode > 3){
      errors.network_mode = "Select Valid Network Mode";
    }
    if(valuez.dhcp < 0 || valuez.dhcp > 1){
      errors.dhcp = "Select Valid DHCP Mode";
    }
    if((valuez.ip != undefined) && (!regex.test(valuez.ip))){
      errors.ip = "Enter Valid IP";
    } 
    if((valuez.gateway != undefined) && (!regex.test(valuez.gateway))){
      errors.gateway = "Enter Valid Gateway";
    }
    if((valuez.subnet != undefined) && (!regex.test(valuez.subnet))){
      errors.subnet = "Enter Valid Subnet";
    }
    if((valuez.dns1 != undefined) && (!regex.test(valuez.dns1))){
      errors.dns1 = "Enter Valid DNS1";
    }
    if((valuez.dns2 != undefined) && (!regex.test(valuez.dns2))){
      errors.dns2 = "Enter Valid DNS2";
    }
    if(valuez.mode_routes < 0 || valuez.mode_routes > 3){
      errors.mode_routes = "Select Valid Data Route";
    }
    if(valuez.in_interval < 1){
      errors.in_interval = "Select Valid Publish Interval";
    }
    if(valuez.in1_mode < 0 || valuez.in1_mode > 3){
      errors.in1_mode = "Select Valid Input Mode";
    }
    if(valuez.in2_mode < 0 || valuez.in2_mode > 3){
      errors.in2_mode = "Select Valid Input Mode";
    }
    if(valuez.mb_mode < 0 || valuez.mb_mode > 3){
      errors.mb_mode = "Select Valid Modbus Mode";
    }
    if(valuez.mb_timeout < 1000){
      errors.mb_timeout = "Set Interval more than 1000";
    }
    if((valuez.data_bits != undefined) && (valuez.data_bits != 7 && valuez.data_bits != 8)){
      errors.data_bits = "Set Valid Data Bits";
    }
    if((valuez.baud != undefined) && (valuez.baud != 9600 && valuez.baud != 4800 && valuez.baud != 115200)){
      errors.baud = "Set Valid Baud Rate";
    }
    if(valuez.parity < 0 || valuez.parity > 2){
      errors.parity = "Select Valid Parity";
    }
    if((valuez.en_custom_pub != undefined) && valuez.en_custom_pub != 0 && valuez.en_custom_pub != 1){
      errors.en_custom_pub = "Select Valid Mode";
    }
    if(valuez.custom_pub_data_pts < 0 || valuez.custom_pub_data_pts > 3){
      errors.custom_pub_data_pts = "Select data points within given range";
    }
    if(valuez.custom_pub_interval <= 0){
      errors.custom_pub_interval = "Interval must be more than 1 minute.";
    }
    if((valuez.stop_bits != undefined) && (valuez.stop_bits != '1' && valuez.stop_bits != '1_5' && valuez.stop_bits != '2')){
      errors.stop_bits = "Select Valid Stop Bits";
    }
    if(valuez.schedule_restart_enable < 0 || valuez.schedule_restart_enable > 2){
      errors.schedule_restart_enable = "Select Valid Restart Mode";
    }
    if(valuez.schedule_restart_hour < 0 || valuez.schedule_restart_hour > 23){
      errors.schedule_restart_hour = "Select Valid Hour";
    }
    if(valuez.schedule_restart_minute < 0 || valuez.schedule_restart_minute > 60){
      errors.schedule_restart_minute = "Select Valid Minute";
    }
    if(valuez.schedule_restart_second < 0 || valuez.schedule_restart_second > 60){
      errors.schedule_restart_second = "Select Valid Seconds";
    }
    return errors;
  }

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    // setInputs(values => ({ ...values, [name]: value }))
  };

  // const handleOffsetChange = (event) => {
  //   event.preventDefault();
  //   const value = event.target.value;
  //   setModbus_offset(value);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(inputs);
  };

  const handleSubmitNetwork = (event) => {
    event.preventDefault();

    var temp_object = {
      "network_mode" : network_modeRef.current.value,
      "dhcp" : dhcpRef.current.value,
      "ip" : ipRef.current.value,
      "gateway" : gatewayRef.current.value,
      "subnet" : subnetRef.current.value, 
      "dns1" : dns1Ref.current.value,
      "dns2" : dns2Ref.current.value
    }

    let errors_obj = validateValues(temp_object);
    // console.log(errors_obj);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      const publish = {
        action: 'network',
        mac_id: mac_id[3],
        network_mode: `${parseInt(network_modeRef.current.value).toString()}`,
        wifi_ssid: `${wifi_ssidRef.current.value}`,
        wifi_pass: `${wifi_passRef.current.value}`,
        dhcp: `${parseInt(dhcpRef.current.value).toString()}`,
        ip: `${ipRef.current.value}`,
        gateway: `${gatewayRef.current.value}`,
        subnet: `${subnetRef.current.value}`,
        dns1: `${dns1Ref.current.value}`,
        dns2: `${dns2Ref.current.value}`,
        lte_apn: `${lte_apnRef.current.value}`
      };

      // console.log(publish);
      publishAxios(publish); 
    }
  };

  const handleSubmitRoutes = (event) => {
    var temp_object = {
      "mode_routes" : mode_routesRef.current.value
    }

    let errors_obj = validateValues(temp_object);
    // console.log(errors_obj);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      const publish = {
        mac_id: mac_id[3],
        action: 'mqtt',
        mode_routes: `${parseInt(mode_routesRef.current.value).toString()}`,
        mqtt_clientid: `${mqtt_clientidRef.current.value}`,
        mqtt_url: `${mqtt_urlRef.current.value}`,
        mqtt_user: `${mqtt_userRef.current.value}`,
        mqtt_pass: `${mqtt_passRef.current.value}`,
        https_api: `${https_apiRef.current.value}`,
        https_backup_api: `${https_backup_apiRef.current.value}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitMQTTCert = (event) => {
    if(uploadFileMQTTS == null){
      setCertMQTTSerr(true);
      openSnackbar('Select a File', 'error');
    }
    else{
      setCertMQTTSerr(false);
      const publish = {
        mac_id: mac_id[3],
        action: 'certs',
        key: `mqtts`,
        content: `${uploadFileMQTTS}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitMQTTCertCliCert = (event) => {
    if(uploadFileMQTTSCliCert == null){
      setCertMQTTSCliCerterr(true);
      openSnackbar('Select a File', 'error');
    }
    else{
      setCertMQTTSCliCerterr(false);
      const publish = {
        mac_id: mac_id[3],
        action: 'certs',
        key: `mqtts_cli_cert`,
        content: `${uploadFileMQTTSCliCert}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitMQTTCertCliKey = (event) => {
    if(uploadFileMQTTSCliKey == null){
      setCertMQTTSCliKeyerr(true);
      openSnackbar('Select a File', 'error');
    }
    else{
      setCertMQTTSCliKeyerr(false);
      const publish = {
        mac_id: mac_id[3],
        action: 'certs',
        key: `mqtts_cli_key`,
        content: `${uploadFileMQTTSCliKey}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitHTTPSCert = (event) => {
    if(uploadFileHTTPS == null){
      setCertHTTPSerr(true);
      openSnackbar('Select a File', 'error');
    }
    else{
      setCertHTTPSerr(false);
      const publish = {
        mac_id: mac_id[3],
        action: 'certs',
        key: `https`,
        content: `${uploadFileHTTPS}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  // const handleChangeModbus = (event) => {
  //     event.preventDefault();
  //     const name = event.target.name;
  //     const value = event.target.value;
  //     setModbus(values => ({ ...values, [name]: value }))
  // }

  const handleSubmitIN1 = (event) => {
    event.preventDefault();
    var temp_object = {
      "in_interval" : in_intervalRef.current.value,
      "in1_mode" : in1_modeRef.current.value
    }
    let errors_obj = validateValues(temp_object);
    console.log(errors_obj);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      const publish = {
        mac_id: mac_id[3],
        action: 'input',
        input_select: `IN1`,
        mode: `${parseInt(in1_modeRef.current.value).toString()}`,
        slope: `${in1_slopeRef.current.value}`,
        offset: `${in1_offsetRef.current.value}`,
        post_interval: `${parseInt(in_intervalRef.current.value).toString()}`
      };
      console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitIN2 = (event) => {
    event.preventDefault();
    var temp_object = {
      "in_interval" : in_intervalRef.current.value,
      "in2_mode" : in2_modeRef.current.value
    }
    let errors_obj = validateValues(temp_object);
    // console.log(errors_obj);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      const publish = {
        mac_id: mac_id[3],
        action: 'input',
        input_select: `IN2`,
        mode: `${parseInt(in2_modeRef.current.value).toString()}`,
        slope: `${in2_slopeRef.current.value}`,
        offset: `${in2_offsetRef.current.value}`,
        post_interval: `${parseInt(in_intervalRef.current.value).toString()}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitModbusConfig = (event) => {
    event.preventDefault();

    var temp_object = {
      "mb_mode" : mb_modeRef.current.value,
      "mb_timeout" : mb_timeoutRef.current.value,
      "data_bits" : data_bitsRef.current.value,
      "baud" : baudRef.current.value,
      "parity" : parityRef.current.value, 
      "stop_bits" : stop_bitsRef.current.value
    }

    let errors_obj = validateValues(temp_object);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      const publish = {
        mac_id: mac_id[3],
        action: 'modbus',
        mb_mode: `${parseInt(mb_modeRef.current.value).toString()}`,
        mb_interval: `${mb_intervalRef.current.value}`,
        mb_timeout: `${mb_timeoutRef.current.value}`,
        mb_offset: `${parseInt(mb_offsetRef.current.value).toString()}`,
        baud: `${parseInt(baudRef.current.value).toString()}`,
        data_bits: `${parseInt(data_bitsRef.current.value).toString()}`,
        parity: `${parseInt(parityRef.current.value).toString()}`,
        stop_bits: `${stop_bitsRef.current.value}`,
        mb_ip: `${mb_ipRef.current.value}`,
        mb_port: `${mb_portRef.current.value}`,
        mb_tcp_slaveid: `${mb_tcp_slaveidRef.current.value}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  const handleSubmitModbusQuery = (event) => {
    if(validate_mb_query(mb_queryRef.current.value))
    {
      setFormErrors({});
      const publish = {
        mac_id: mac_id[3],
        action: 'modbus',
        query: `${mb_queryRef.current.value}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
    else
    {
      var temp_object = {
        "mb_query" : "Invalid Query Format."
      };
      setFormErrors(temp_object);
      openSnackbar("Enter Valid Query Format.", "error");
    }
  };

  const handleSubmitModbusAddressMap = (event) => {
    const publish = {
      mac_id: mac_id[3],
      action: 'modbus',
      cmd: 'mb_address_map',
      // data: JSON.stringify(temp2)
      // data: JSON.parse((mb_address_mapRef.current.value))
      data: JSON.parse(`${mb_address_mapRef.current.value}`)
      // data: JSON.parse(mb_address_mapRef.current.value)
    };
    // console.log(publish);
    publishAxios(publish);
  };

  const handleSubmitEraseModbusQuery = (event) => {
    const publish = {
      mac_id: mac_id[3],
      action: 'modbus',
      cmd: 'erase_queries'
    };
    // console.log(publish);
    publishAxios(publish);
  };

  const handleSubmitEraseModbusAdressMap = (event) => {
    const publish = {
      mac_id: mac_id[3],
      action: 'modbus',
      cmd: 'erase_mb_address_map'
    };
    // console.log(publish);
    publishAxios(publish);
  };

  const handleSubmitCustomPublish = (event) => {
    event.preventDefault();

    var temp_object = {
      "en_custom_pub" : en_custom_pubRef.current.value
    }

    if(en_custom_pubRef.current.value == 1){
      temp_object.custom_pub_interval = custom_pub_intervalRef.current.value;
      temp_object.custom_pub_data_pts = custom_pub_data_ptsRef.current.value;
    }

    let errors_obj = validateValues(temp_object);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      if(en_custom_pubRef.current.value == 0){
        const publish = {
          mac_id: mac_id[3],
          action: 'modbus',
          cmd: "disable_custom_publish"
        };

        // console.log(publish);
      publishAxios(publish);
      }
      else{
        const publish = {
          mac_id: mac_id[3],
          action: 'modbus',
          cmd: "enable_custom_publish",
          interval: `${parseInt(custom_pub_intervalRef.current.value).toString()}`,
          data_points: `${parseInt(custom_pub_data_ptsRef.current.value).toString()}`
        };

        // console.log(publish);
      publishAxios(publish);
      }
    }
  };
  
  const handleSubmitReboot = (event) => {
    const publish = {
      mac_id: mac_id[3],
      action: 'system',
      cmd: 'reboot'
    };
    // console.log(publish);
    publishAxios(publish);
  };

  const handleSubmitSystem = (event) => {
    event.preventDefault();

    var temp_object = {
      "schedule_restart_enable" : schedule_restart_enableRef.current.value,
      "schedule_restart_hour" : schedule_restart_hourRef.current.value,
      "schedule_restart_minute" : schedule_restart_minuteRef.current.value,
      "schedule_restart_second" : schedule_restart_secondRef.current.value
    }

    let errors_obj = validateValues(temp_object);
    // console.log(errors_obj);
    var object_length = Object.keys(errors_obj).length;
    if(object_length > 0){
      setFormErrors(errors_obj);
      openSnackbar('Enter Valid Values', 'error');
    }
    else{
      setFormErrors(errors_obj);
      const publish = {
        mac_id: mac_id[3],
        action: 'schedule_restart',
        schedule_restart_enable: `${parseInt(schedule_restart_enableRef.current.value).toString()}`,
        schedule_restart_hour: `${parseInt(schedule_restart_hourRef.current.value).toString()}`,
        schedule_restart_minute: `${parseInt(schedule_restart_minuteRef.current.value).toString()}`,
        schedule_restart_second: `${parseInt(schedule_restart_secondRef.current.value).toString()}`
      };
      // console.log(publish);
      publishAxios(publish);
    }
  };

  // const handleSubmitFormat = (event) => {
  //   const publish = {
  //     mac_id: mac_id[3],
  //     action: 'modbus',
  //     cmd: 'erase_queries'
  //   };
  //   // console.log(publish);
  //   publishAxios(publish);
  // };

  const previewQuery = () => {
    if(validate_mb_query(mb_queryRef.current.value)){
      setFormErrors({});
      setQuery(mb_queryRef.current.value);
    }
    else{
      var temp_object = {
        "mb_query" : "Invalid Query Format."
      };
      setFormErrors(temp_object);
      openSnackbar("Enter Valid Query Format.", "error");
    }
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${server_url}/api/device/find/${mac_id[3]}`)
      .then((response) => {
        // console.log('DEBUG zone response', response.data[0]);
        console.log(response.data[0]);
        setDevice(response.data[0]);
        setDefaults(response.data[0]);
        setData_received(true);
        setTimeout(() => {
          setDefaults({});
          setLoading(false);
        }, 200);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data_received) {
      let str = defaults.query;
      setModbus_offset(defaults.mb_offset);
      setQuery(str);
    }
  }, [data_received]);

  const [selectedFileMQTTS, setSelectedFileMQTTS] = useState(null);
  const [uploadFileMQTTS, setUploadFileMQTTS] = useState(null);

  const [selectedFileMQTTSCliCert, setSelectedFileMQTTSCliCert] = useState(null);
  const [uploadFileMQTTSCliCert, setUploadFileMQTTSCliCert] = useState(null);

  const [selectedFileMQTTSCliKey, setSelectedFileMQTTSCliKey] = useState(null);
  const [uploadFileMQTTSCliKey, setUploadFileMQTTSCliKey] = useState(null);

  const [selectedFileHTTPS, setSelectedFileHTTPS] = useState(null);
  const [uploadFileHTTPS, setUploadFileHTTPS] = useState(null);

  const handleFileSelectMQTTS = (event) => {
    setSelectedFileMQTTS(event.target.files[0]);

    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      let result_ = event.target.result;
      let singleLineCertificate = result_.replace(/\r?\n|\r/g, ' \n');
      // console.log(singleLineCertificate);
      setUploadFileMQTTS(singleLineCertificate);
    };
    reader.readAsText(file);
  };

  const handleFileSelectMQTTSCliCert = (event) => {
    setSelectedFileMQTTSCliCert(event.target.files[0]);

    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      let result_ = event.target.result;
      let singleLineCertificate = result_.replace(/\r?\n|\r/g, ' \n');
      // console.log(singleLineCertificate);
      setUploadFileMQTTSCliCert(singleLineCertificate);
    };
    reader.readAsText(file);
  };

  const handleFileSelectMQTTSCliKey = (event) => {
    setSelectedFileMQTTSCliKey(event.target.files[0]);

    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      let result_ = event.target.result;
      let singleLineCertificate = result_.replace(/\r?\n|\r/g, ' \n');
      // console.log(singleLineCertificate);
      setUploadFileMQTTSCliKey(singleLineCertificate);
    };
    reader.readAsText(file);
  };

  const handleFileSelectHTTPS = (event) => {
    setSelectedFileHTTPS(event.target.files[0]);
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      let result_ = event.target.result;
      let singleLineCertificate = result_.replace(/\r?\n|\r/g, ' \n');
      // console.log(singleLineCertificate);
      setUploadFileHTTPS(singleLineCertificate);
    };
    reader.readAsText(file);
    console.log(event.target.files[0]);
  };

  useEffect(() => {
  }, [defaults]);

  useEffect(() => {
    // console.log(formErrors);
  }, [formErrors]);

  function publishAxios(params) {
    openSnackbar('Please Wait', 'info');
    console.log(device);
    let current_time = parseInt(Math.floor(Date.now() / 1000));
    let gateway_time = parseInt(moment.utc(device.updatedAt).local() / 1000);
    let http_refresh_interval_mins =
      parseInt(device.http_refresh_interval_mins) * 60 * 3;
    // console.log("current_time" + current_time)
    // console.log("gateway_time" + gateway_time)
    // console.log("http_refresh_interval_mins" + http_refresh_interval_mins)

    if (current_time - gateway_time < http_refresh_interval_mins) {
      axios({
        method: 'post',
        url: `${server_url}/api/device/config/update`,
        data: params,
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => {
          // alert(`${res.data.message}`)
          // console.log(res.data)
          // console.log(message, severity)
          // openSnackbar("error", JSON.stringify(res.data.message));
          openSnackbar(res.data.message, 'success');

          // openSnackbar("error", res.data.message);
        })
        .catch((error) => {
          openSnackbar('Something went wrong..', 'error');
          console.log(error);
        });
    } else {
      openSnackbar('Gateway is offline!', 'warning');
    }
  }

  return (
    <Grid>
      {loading ? <LinearProgress sx={{ m: 2 }} /> : false}
      <Card>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
        {/* <PageTitleWrapper>
                    <PageTitle
                        heading="Firmware"
                        subHeading=""
                        docs="Add/" />
                </PageTitleWrapper> */}
        <Divider />
        <CardContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: 'auto' }
            }}
            noValidate
            autoComplete="off"
          >
            <Accordion expanded={true}>
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                color="primary"
              >
                <Typography variant="h4" gutterBottom>
                  Device
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  General
                </Typography>

                <TextField
                  // disabled
                  // required
                  // helperText={device.name}
                  // defaultValue={"Zone Name"}
                  id="outlined-required"
                  label="Zone Name"
                  defaultValue="No value"
                  name="name"
                  value={defaults.name}
                  onChange={handleChange}
                />
                <TextField
                  // disabled
                  // required
                  id="outlined-required"
                  label="Modules"
                  defaultValue="No value"
                  name="modules"
                  value={inputs.modules || defaults.modules}
                  onChange={handleChange}
                />
                <TextField
                  // disabled
                  // required
                  label="Location"
                  id="outlined-required"
                  defaultValue="Mumbai, India"
                  name="location"
                  value={inputs.location || defaults.location}
                  onChange={handleChange}
                />
                {/* //update button below general commented */}
                {/* <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </Grid> */}
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                color="primary"
              >
                <Typography variant="h4" gutterBottom>
                  Network
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  Selection
                </Typography>

                <TextField
                  id="outlined-select-currency"
                  inputRef={network_modeRef}
                  // select
                  label="Network Selection"
                  defaultValue={0}
                  name="network_mode"
                  type="number"
                  value={defaults.network_mode}
                  helperText= {"0 : Disable | 1 : Wifi | 2 : Ethernet | 3 : 4G "}
                  inputProps={{ min: 0, max: 3 , step: 1}}
                  // InputProps={{inputprops:{min: 0, max: 3, step: 1}}}
                  // helperText={`Current Value : ${find_label(device.network_mode, network_mode)}`}
                  error = {formErrors.network_mode ? true : false}
                >
                  {/* {network_mode.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))} */}
                </TextField>
                {/* <TextField
                  // disabled
                  // required
                  inputRef={network_modeRef}
                  id="outlined-required"
                  label="Network Mode"
                  defaultValue="Mode"
                  // value={inputs.wifi_ssid || defaults.wifi_ssid}
                  name="network_mode"
                  value={defaults.network_mode}
                  helperText="0 : Disable | 1 : Wifi | 2 : Ethernet | 3 : 4G"
                /> */}
                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  Wifi
                </Typography>
                <TextField
                  // disabled
                  // required
                  id="outlined-required"
                  label="SSID"
                  defaultValue="SSID"
                  // value={inputs.wifi_ssid || defaults.wifi_ssid}
                  name="wifi_ssid"
                  value={defaults.wifi_ssid}
                  inputRef={wifi_ssidRef}
                />
                <TextField
                  // disabled

                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  defaultValue="Password"
                  // autoComplete="current-password"
                  value={defaults.wifi_pass}
                  name="wifi_pass"
                  inputRef={wifi_passRef}
                />

                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Static IP (LAN)
                  </Typography>

                  {/* <TextField
                        id="outlined-select-currency"
                        select
                        label="Enable"
                        value="true"
                        onChange={handleChange}
                      >
                      {enable.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                              {option.label}
                          </MenuItem>
                        ))}
                      </TextField> */}
                  <TextField
                    id="outlined-select-currency"
                    inputRef={dhcpRef}
                    // select
                    label="DHCP"
                    type="number"
                    defaultValue={0}
                    // helperText={`Current Value : ${find_label(
                    //   device.dhcp,
                    //   dhcp_mode
                    // )}`}
                    helperText="0 : Static | 1 : Dynamic"
                    inputProps={{ min: 0, max: 1 , step: 1}}
                    value={defaults.dhcp}
                    name='dhcp'
                    error = {formErrors.dhcp ? true : false}
                  >
                    {/* {dhcp_mode.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </TextField>
                  {/* <TextField
                    // disabled
                    inputRef={dhcpRef}
                    id="outlined-required"
                    label="DHCP"
                    defaultValue="DHCP"
                    name="dhcp"
                    value={defaults.dhcp}
                    helperText="0 : Static | 1 : Dynamic"
                  /> */}
                  <TextField
                    // disabled
                    inputRef={ipRef}
                    id="outlined-required"
                    label="IP Address"
                    defaultValue="192.168.29.100"
                    name="ip"
                    value={defaults.static_ip}
                    helperText = {formErrors.ip ? "Enter Valid IP Address" : ""}
                    error = {formErrors.ip ? true : false}
                  />
                  <TextField
                    // disabled
                    inputRef={gatewayRef}
                    id="outlined-required"
                    label="Gateway"
                    defaultValue="192.168.29.1"
                    name="gateway"
                    helperText = {formErrors.gateway ? "Enter Valid Gateway" : ""}
                    value={defaults.static_gateway}
                    error = {formErrors.gateway ? true : false}
                  />
                  <TextField
                    // disabled
                    inputRef={subnetRef}
                    id="outlined-required"
                    label="Subnet"
                    defaultValue="255.255.255.0"
                    name="subnet"
                    helperText = {formErrors.subnet ? "Enter Valid Subnet" : ""}
                    value={defaults.static_subnet}
                    error = {formErrors.subnet ? true : false}
                  />
                  <TextField
                    // disabled
                    inputRef={dns1Ref}
                    id="outlined"
                    label="DNS 1"
                    defaultValue="8.8.8.8"
                    name="dns1"
                    value={defaults.static_dns1}
                    helperText = {formErrors.dns1 ? "Enter Valid DNS" : ""}
                    error = {formErrors.dns1 ? true : false}
                  />
                  <TextField
                    // disabled
                    inputRef={dns2Ref}
                    id="outlined-required"
                    label="DNS 2"
                    defaultValue="8.8.2.2"
                    name="dns2"
                    value={defaults.static_dns2}
                    error = {formErrors.dns2 ? true : false}
                    helperText = {formErrors.dns2 ? "Enter Valid DNS" : ""}
                  />
                </div>

                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    4G LTE
                  </Typography>
                  <TextField
                    // disabled
                    inputRef={lte_apnRef}
                    id="outlined-required"
                    label="Set APN"
                    defaultValue="m2misafe"
                    name="lte_apn"
                    value={defaults.lte_apn}
                  />
                </div>

                <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmitNetwork}
                  >
                    Update
                  </Button>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4" gutterBottom>
                  Data Routes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Mode
                  </Typography>
                  <TextField
                    id="outlined-select-currency"
                    inputRef={mode_routesRef}
                    // select
                    label="Mode"
                    defaultValue={0}
                    value={defaults.mode_routes}
                    helperText="0 : MQTT | 1 : HTTP | 2 : MQTTS | 3 : HTTPS"
                    name="mode_routes"
                    type='number'
                    inputProps={{ min: 0, max: 3 , step: 1}}
                    error = {formErrors.mode_routes ? true : false}
                  >
                    {/* {data_routes_mode.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </TextField>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    MQTT Configuration
                  </Typography>
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="MQTT ClientID"
                    defaultValue="MQTT Client"
                    name="mqtt_clientid"
                    value={defaults.mqtt_clientid}
                    inputRef={mqtt_clientidRef}
                  />
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="MQTT Broker"
                    defaultValue="mqtt://test.com:1883/"
                    name="mqtt_url"
                    value={defaults.mqtt_url}
                    inputRef={mqtt_urlRef}
                    helperText="Eg. 192.168.0.10:1883 | test.mosquitto.org:1883"
                  />
                  <TextField
                    // disabled
                    type="password"
                    id="outlined-required"
                    label="Broker Username"
                    defaultValue="MQTT User"
                    name="mqtt_user"
                    value={defaults.mqtt_user}
                    inputRef={mqtt_userRef}
                  />
                  <TextField
                    // disabled
                    type="password"
                    id="outlined-required"
                    label="Broker Password"
                    defaultValue="MQTT Password"
                    name="mqtt_pass"
                    value={defaults.mqtt_pass}
                    inputRef={mqtt_passRef}
                  />
                </div>
                <Typography
                  sx={{ p: 1 }}
                  variant="h5"
                  component="h5"
                  gutterBottom
                >
                  HTTP(S) API
                </Typography>
                <TextField
                  // disabled
                  id="outlined-required"
                  label="HTTP(S) API"
                  defaultValue="http://example.com/test"
                  value={defaults.https_api}
                  inputRef={https_apiRef}
                  helperText="Eg. http(s)://192.168.0.10:8080/api"
                />
                <TextField
                  // disabled
                  id="outlined-required"
                  label="HTTP(S) Backup API"
                  defaultValue="http://example.com/test"
                  value={defaults.https_backup_api}
                  inputRef={https_backup_apiRef}
                />
                <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmitRoutes}
                  >
                    Update
                  </Button>
                </Grid>
                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Upload Certificate (Optional)
                  </Typography>
                  
                  <Grid container sx={{ m: { xs: 1, md: 1 } }}>
                    <Grid item xs={4}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        color={(certMQTTSerr == true) ? 'error' : 'primary'}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add MQTTS Certificate
                        <input
                          type="file"
                          accept=".pem, .cer"
                          onChange={handleFileSelectMQTTS}
                          hidden
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon fontSize="small" />}
                        onClick={handleSubmitMQTTCert}
                      >
                        Upload
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      {selectedFileMQTTS ? (
                        <div>
                          <p><b>Filename:</b> {selectedFileMQTTS.name} ({selectedFileMQTTS.size} bytes)</p> 
                        </div>
                      ) : (
                        <p>Select a file to show details</p>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container sx={{ m: { xs: 1, md: 1 } }}>
                    <Grid item xs={4}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        color={(certMQTTSCliCerterr == true) ? 'error' : 'primary'}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                      Add MQTTS Client Certificate
                      <input
                        type="file"
                        accept=".pem, .cer"
                        onChange={handleFileSelectMQTTSCliCert}
                        hidden
                      />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon fontSize="small" />}
                        onClick={handleSubmitMQTTCertCliCert}
                      >
                        Upload
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      {selectedFileMQTTSCliCert ? (
                        <div>
                          <p><b>Filename:</b> {selectedFileMQTTSCliCert.name} ({selectedFileMQTTSCliCert.size} bytes)</p> 
                        </div>
                      ) : (
                        <p>Select a file to show details</p>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container sx={{ m: { xs: 1, md: 1 } }}>
                    <Grid item xs={4}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        color={(certMQTTSCliKeyerr == true) ? 'error' : 'primary'}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add MQTTS Client Key
                        <input
                          type="file"
                          accept=".pem, .cer, .key"
                          onChange={handleFileSelectMQTTSCliKey}
                          hidden
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon fontSize="small" />}
                        onClick={handleSubmitMQTTCertCliKey}
                      >
                        Upload
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      {selectedFileMQTTSCliKey ? (
                        <div>
                          <p><b>Filename:</b> {selectedFileMQTTSCliKey.name} ({selectedFileMQTTSCliKey.size} bytes)</p>
                        </div>
                      ) : (
                        <p>Select a file to show details</p>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container sx={{ m: { xs: 1, md: 1 } }}>
                    <Grid item xs={4}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        color={(certHTTPSerr == true) ? 'error' : 'primary'}
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                      >
                        Add HTTPS Certificate
                        <input
                          type="file"
                          accept=".pem"
                          onChange={handleFileSelectHTTPS}
                          hidden
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        sx={{ m: { xs: 1, md: 1 } }}
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon fontSize="small" />}
                        onClick={handleSubmitHTTPSCert}
                      >
                        Upload
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      {selectedFileHTTPS ? (
                        <div>
                          <p><b>Filename:</b> {selectedFileHTTPS.name} ({selectedFileHTTPS.size} bytes)</p>
                        </div>
                      ) : (
                        <p>Select a file to show details</p>
                      )}
                    </Grid>
                  </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4" gutterBottom>
                  IO Config
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  Publish Interval
                  </Typography>
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Publish Interval"
                    defaultValue={1}
                    type="number"
                    name="in_interval"
                    inputProps={{ min: 1}}
                    value={defaults.in_interval}
                    inputRef={in_intervalRef}
                    helperText="seconds | Min : 1"
                    error = {formErrors.in_interval ? true : false}
                  />
                </div>
                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Input 1
                  </Typography>
                  <TextField
                    id="outlined-select-currency"
                    inputRef={in1_modeRef}
                    // select
                    label="Mode"
                    defaultValue={0}
                    type="number"
                    name="in1_mode"
                    value={defaults.in1_mode}
                    inputProps={{ min: 0, max: 3 , step: 1}}
                    helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                    error = {formErrors.in1_mode ? true : false}
                  >
                    {/* {input1_mode.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </TextField>
                  {/* <TextField
                    // disabled
                    id="outlined-required"
                    label="Mode"
                    defaultValue="0"
                    name="mode_routes"
                    value={defaults.mode_routes}
                    inputRef={in1_modeRef}
                    helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                  /> */}
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Slope"
                    defaultValue="0"
                    name="in1_slope"
                    value={defaults.in1_slope}
                    inputRef={in1_slopeRef}
                    // helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                  />
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Offset"
                    defaultValue="0"
                    name="in1_offset"
                    value={defaults.in1_offset}
                    inputRef={in1_offsetRef}
                    // helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                  />
                </div>
                <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmitIN1}
                  >
                    Update
                  </Button>
                </Grid>
                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Input 2
                  </Typography>
                  <TextField
                    id="outlined-select-currency"
                    inputRef={in2_modeRef}
                    // select
                    label="Mode"
                    defaultValue={0}
                    name="in2_mode"
                    inputProps={{ min: 0, max: 3 , step: 1}}
                    value={defaults.in2_mode}
                    helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                    error = {formErrors.in2_mode ? true : false}
                  >
                    {/* {input2_mode.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </TextField>
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Slope"
                    defaultValue="0"
                    name="in2_slope"
                    value={defaults.in2_slope}
                    inputRef={in2_slopeRef}
                    // helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                  />
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Offset"
                    defaultValue="0"
                    name="in2_offset"
                    value={defaults.in2_offset}
                    inputRef={in2_offsetRef}
                    // helperText="0 : Disable | 1 : Counter | 2 : 4-20mA | 3 : NTC"
                  />
                </div>
                <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmitIN2}
                  >
                    Update
                  </Button>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4" gutterBottom>
                  Modbus Settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Modbus Mode
                  </Typography>
                  <TextField
                    id="outlined-select-currency"
                    inputRef={mb_modeRef}
                    // select
                    label="Mode"
                    type="number"
                    defaultValue={1}
                    value={defaults.mb_mode}
                    name="mb_mode"
                    helperText="0 : Disable | 1 : RTU | 2 : ASCII | 3 : TCPIP"
                    inputProps={{ min: 0, max: 3 , step: 1}}
                    error = {formErrors.mb_mode ? true : false}
                  >
                    {/* {modbus_mode.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
                  </TextField>
                  <TextField
                    inputRef={mb_intervalRef}
                    name="mb_interval"
                    value={defaults.mb_interval}
                    id="outlined-required"
                    label="Scan Interval"
                    defaultValue="50"
                    helperText="milliseconds"
                  />
                  <TextField
                    inputRef={mb_timeoutRef}
                    name="mb_timeout"
                    value={defaults.mb_timeout}
                    id="outlined-required"
                    label="Scan Timeout"
                    type="number"
                    defaultValue={1000}
                    inputProps={{ min: 1000}}
                    helperText="milliseconds | Min : 1000"
                    error = {formErrors.mb_timeout ? true : false}
                  />
                  <TextField
                    inputRef={mb_offsetRef}
                    name="mb_offset"
                    value={defaults.mb_offset}
                    id="outlined-required"
                    label="Offset"
                    type="number"
                    defaultValue={1}
                    inputProps={{ min: 0, step: 1}}
                    onChange={event => setModbus_offset(event.target.value)}
                    // helperText="milliseconds | Min : 1000"
                    // error = {formErrors.mb_offset ? true : false}
                  />
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    MODBUS RTU / ASCII
                  </Typography>
                  {/* <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Enable"
                                        value="false"
                                        onChange={handleChange}
                                    >
                                        {enable.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField> */}
                  <TextField
                    id="outlined-select-currency"
                    inputRef={baudRef}
                    // select
                    label="Baud Rate"
                    defaultValue={9600}
                    value={defaults.baud}
                    name='baud'
                    type='number'
                    helperText="4800 / 9600 / 115200"
                    error = {formErrors.baud ? true : false}
                  >
                    {/* {modbus_baudrate.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))} */}
                  </TextField>
                  {/* <TextField
                    inputRef={baudRef}
                    id="outlined-required"
                    label="Baud Rate"
                    defaultValue="Baud Rate"
                    name="baud"
                    value={defaults.baud}
                    helperText="4800 / 9600 / 115200"
                  /> */}

                  <TextField
                    inputRef={data_bitsRef}
                    id="outlined-required"
                    label="Data Bits"
                    defaultValue={8}
                    name="data_bits"
                    value={defaults.data_bits}
                    helperText="7,8"
                    type='number'
                    error = {formErrors.data_bits ? true : false}
                    // inputProps={{readOnly: true}}
                  />
                  <TextField
                    id="outlined-select-currency"
                    inputRef={parityRef}
                    // select
                    label="Parity"
                    name="parity"
                    type="number"
                    defaultValue={0}
                    value={defaults.parity}
                    helperText="0 : DISABLE | 1 :  EVEN | 2 : ODD"
                    inputProps={{ min: 0, max: 2 , step: 1}}
                    error = {formErrors.parity ? true : false}
                  >
                    {/* {modbus_parity.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))} */}
                  </TextField>
                  {/* <TextField
                    inputRef={parityRef}
                    id="outlined-required"
                    label="Parity"
                    defaultValue="Parity"
                    name="parity"
                    value={defaults.parity}
                    helperText="EVEN, ODD, DISABLE"
                  /> */}
                  <TextField
                    id="outlined-select-currency"
                    inputRef={stop_bitsRef}
                    // select
                    label="Stop Bits"
                    defaultValue={"1"}
                    name='stop_bits'
                    value={defaults.stop_bits}
                    helperText="1, 1_5, 2"
                    error = {formErrors.stop_bits ? true : false}
                  >
                    {/* {modbus_stop_bits.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))} */}
                  </TextField>
                  {/* <TextField
                    inputRef={stop_bitsRef}
                    id="outlined-required"
                    label="Stop Bits"
                    defaultValue="Stop Bits"
                    name="stop_bits"
                    value={defaults.stop_bits}
                    helperText="1, 1_5, 2"
                  /> */}
                </div>
                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  Modbus TCP
                </Typography>
                <TextField
                  inputRef={mb_ipRef}
                  name="mb_ip"
                  value={defaults.mb_ip}
                  id="outlined-required"
                  label="IP Address"
                  defaultValue="[192.168.29.100, 192.168.29.101]"
                  helperText="[ <address_1>, <address_2>, ... ]"
                />
                <TextField
                  inputRef={mb_portRef}
                  name="mb_port"
                  value={defaults.mb_port}
                  id="outlined-required"
                  label="Port"
                  defaultValue="502"
                />
                <TextField
                  inputRef={mb_tcp_slaveidRef}
                  name="mb_tcp_slaveid"
                  value={defaults.mb_tcp_slaveid}
                  id="outlined-required"
                  label="Slave ID"
                  defaultValue={"[0, 1]"}
                  helperText="[ <slave_id_1>, <slave_id_2>, ... ]"
                />

                <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmitModbusConfig}
                  >
                    Update
                  </Button>
                </Grid>

                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    MQTT Modbus Response topic
                  </Typography>

                  <TextField
                    disabled
                    // inputRef={mb_queryRef}
                    name="mb_topic"
                    value={mac_id[3] + '/data'}
                    id="outlined-required"
                    label="MQTT Data Topic"
                    defaultValue="mac_id/data"
                  />

                  <div>
                    <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                      Modbus Response Preview (JSON)
                    </Typography>
                    <Card
                      sx={{ p: 2, m: 1, maxHeight: '50vh', overflow: 'auto' }}
                      variant="outlined"
                    >
                      <JSONPretty
                        id="json-pretty"
                        data={modbus_query_to_JSON(query)}
                      ></JSONPretty>
                    </Card>
                  </div>
                </div>

                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  Modbus Query
                </Typography>

                <div id="config_modbus">
                  <TextField
                    inputRef={mb_queryRef}
                    name="mb_query"
                    value={defaults.query}
                    id="outlined-required"
                    label="Modbus Query"
                    defaultValue="[[1,3,100,50,3,0]]"
                    helperText="[ [ <slaveid>, <function_code>, <address>, <no_of_registers>, <data_type>, <index> ], ... ]"
                    error = {formErrors.mb_query ? true : false}
                  />
                  <Grid container justifyContent="" alignItems="left">
                    <Button
                      sx={{ m: { xs: 1, md: 1 } }}
                      variant="contained"
                      component="label"
                      // startIcon={<SendIcon fontSize="small" />}
                      onClick={previewQuery}
                    >
                      Preview
                    </Button>
                    <Button
                      sx={{ m: { xs: 1, md: 1 } }}
                      variant="contained"
                      component="label"
                      startIcon={<SendIcon fontSize="small" />}
                      onClick={handleSubmitModbusQuery}
                    >
                      Update
                    </Button>
                    <Button
                      sx={{ m: { xs: 1, md: 1 } }}
                      variant="contained"
                      component="label"
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={handleSubmitEraseModbusQuery}
                    >
                      Erase
                    </Button>
                  </Grid>
                </div>
                <div id="config_modbus">
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Modbus Address Mapping
                  </Typography>

                  <TextField
                    inputRef={mb_address_mapRef}
                    name="mb_address_map"
                    value={JSON.stringify(defaults.mb_address_map)}
                    id="outlined-required"
                    label="Modbus Address Mapping"
                    defaultValue='{"voltage": ["1D4", "2D7"], "current": ["1D17", "3D124"]}'
                    helperText='{"<new_tag_1>": ["<slave_id_1><tag_name_1>", "<slave_id_2><tag_name_2>"], "<new_tag_2>": ["<slave_id_1><tag_name_1>", "<slave_id_2><tag_name_2>"] ,...}'
                  />
                  <Grid container justifyContent="" alignItems="left">
                    <Button
                      sx={{ m: { xs: 1, md: 1 } }}
                      variant="contained"
                      component="label"
                      startIcon={<SendIcon fontSize="small" />}
                      onClick={handleSubmitModbusAddressMap}
                    >
                      Update
                    </Button>
                    <Button
                      sx={{ m: { xs: 1, md: 1 } }}
                      variant="contained"
                      component="label"
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={handleSubmitEraseModbusAdressMap}
                    >
                      Erase
                    </Button>
                  </Grid>
                </div>

                <div id="config_modbus">
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Custom Publish Pattern
                  </Typography>
                </div>

                <TextField
                  id="outlined-select-currency"
                  inputRef={en_custom_pubRef}
                  // select
                  label="Mode"
                  type="number"
                  defaultValue={0}
                  value={defaults.en_custom_pub}
                  name="en_custom_pub"
                  helperText="0 : Disable | 1 : Enable"
                  inputProps={{ min: 0, max: 1 , step: 1}}
                  error = {formErrors.en_custom_pub ? true : false}
                >
                </TextField>
                <TextField
                  inputRef={custom_pub_intervalRef}
                  name="custom_pub_interval"
                  value={defaults.custom_pub_interval}
                  id="outlined-required"
                  label="Interval"
                  defaultValue="1"
                  inputProps={{ min: 1}}
                  helperText="minutes | Min : 1"
                  error = {formErrors.custom_pub_interval ? true : false}
                />
                <TextField
                  inputRef={custom_pub_data_ptsRef}
                  name="custom_pub_data_pts"
                  value={defaults.custom_pub_data_pts}
                  id="outlined-required"
                  label="Data Points"
                  type="number"
                  defaultValue={3}
                  helperText="Range: 0 to 3"
                  inputProps={{ min: 0, max: 3 , step: 1}}
                  error = {formErrors.custom_pub_data_pts ? true : false}
                />

                <Grid container justifyContent="" alignItems="">
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    onClick={handleSubmitCustomPublish}
                  >
                    Update
                  </Button>
                </Grid>

                {/* <Grid container justifyContent="" alignItems="">
                                    <Button
                                        sx={{ m: { xs: 1, md: 1 } }}
                                        variant="contained"
                                        component="label"
                                        startIcon={<UploadIcon fontSize="small" />}
                                    // onClick={handleSubmit}
                                    >
                                        Update
                                    </Button>
                                </Grid> */}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4" gutterBottom>
                  System
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                    Scheduled Restart
                  </Typography>
                  <TextField
                    id="outlined-select-currency"
                    inputRef={schedule_restart_enableRef}
                    // select
                    label="Mode"
                    defaultValue={1}
                    value={defaults.schedule_restart_enable}
                    name="schedule_restart_enable"
                    type='number'
                    helperText="0 : Disable | 1 : Enable"
                    inputProps={{ min: 0, max: 1 , step: 1}}
                    error = {formErrors.schedule_restart_enable ? true : false}
                  >
                    {/* {schedule_restart_mode.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))} */}
                  </TextField>
                  {/* <TextField
                    // disabled
                    id="outlined-required"
                    label="Mode"
                    defaultValue="1"
                    name="schedule_restart_enable"
                    value={defaults.schedule_restart_enable}
                    inputRef={schedule_restart_enableRef}
                    helperText="0 : Disable | 1 : Enable"
                  /> */}
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Hour"
                    type='number'
                    defaultValue={13}
                    name="schedule_restart_hour"
                    value={defaults.schedule_restart_hour}
                    inputRef={schedule_restart_hourRef}
                    helperText="Range: 0 to 23"
                    inputProps={{ min: 0, max: 23 , step: 1}}
                    error = {formErrors.schedule_restart_hour ? true : false}
                  />
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Minutes"
                    defaultValue={30}
                    name="schedule_restart_minute"
                    value={defaults.schedule_restart_minute}
                    type='number'
                    inputRef={schedule_restart_minuteRef}
                    helperText="Range: 0 to 60"
                    inputProps={{ min: 0, max: 60 , step: 1}}
                    error = {formErrors.schedule_restart_minute ? true : false}
                  />
                  <TextField
                    // disabled
                    id="outlined-required"
                    label="Seconds"
                    defaultValue={0}
                    name="schedule_restart_second"
                    type='number'
                    value={defaults.schedule_restart_second}
                    inputRef={schedule_restart_secondRef}
                    helperText="Range: 0 to 60"
                    inputProps={{ min: 0, max: 60 , step: 1}}
                    error = {formErrors.schedule_restart_second ? true : false}
                  />
                  <Grid container justifyContent="" alignItems="">
                    <Button
                      sx={{ m: { xs: 1, md: 1 } }}
                      variant="contained"
                      component="label"
                      startIcon={<UploadIcon fontSize="small" />}
                      onClick={handleSubmitSystem}
                    >
                      Update
                    </Button>
                  </Grid>
                </div>
                <Typography sx={{ p: 1 }} variant="h5" gutterBottom>
                  Commands
                </Typography>

                <Grid container justifyContent="" alignItems="left">
                  {/* <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon fontSize="small" />}
                    // onClick={handleSubmitFormat}
                  >
                    Format Memory
                  </Button> */}
                  <Button
                    sx={{ m: { xs: 1, md: 1 } }}
                    variant="contained"
                    component="label"
                    startIcon={<RestartAltIcon fontSize="small" />}
                    onClick={handleSubmitReboot}
                  >
                    Reboot Gateway
                  </Button>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DeviceSettingsCard;