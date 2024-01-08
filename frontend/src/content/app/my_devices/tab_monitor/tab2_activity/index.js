import {React, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import { Helmet } from 'react-helmet-async';
import { LinearProgress, Grid } from '@mui/material';
import { server_url } from 'src/api/app.js';

import ActivityLogsTable from './ActivityLogsTable';
import StatCard from './StatCard';
import TasksAnalytics from './ActivityGraph';

import axios from 'axios';

function Activity() {
  const [activties, setActivties] = useState([]);
  const [getStats, setgetStats] = useState([0]);
  const [loading, setLoading] = useState(false);

  const mac_id = location.pathname.split('/')
  // console.log(mac_id[3])
  // var url = `${server_url}/api/logs/${mac_id[3]}?page=1&limit=100`
  var url = `${server_url}/api/logs/${mac_id[3]}?page=1&limit=50`
  var url1 = `${server_url}/api/logs/getstats/${mac_id[3]}`
  
  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setActivties(response.data.results);
        setLoading(false);
        // activties = response.data;
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    setLoading(true);
    axios
      .get(url1)
      .then((response) => {
        setgetStats(response.data);
        setLoading(false);
        // activties = response.data;
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);


  return (
    <Box>
      <Helmet>
        <title>Activity | Gateway Manager</title>
      </Helmet>
      {loading ? <LinearProgress sx={{ m: 2 }} /> : false}
      <TasksAnalytics />
      <Grid
        container
        direction="row"
        // justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12} sm={6} md={4}>
          <StatCard description={"Throughput - 24 hours"} value={`${getStats.throughput_24h || "~"} %`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard description={"Throughput - 7 days"} value={`${getStats.throughput_7d || "~"} %`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard description={"Activities past week"} value={`${getStats.activity_past_week || "~"}`} />
        </Grid>
        <Grid item xs={12}>
        <ActivityLogsTable cryptoOrders={activties} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Activity;
