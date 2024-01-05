import {
  Card,
  Box,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  LinearProgress
} from '@mui/material';

import { styled } from '@mui/material/styles';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { server_url } from 'src/api/app.js';
import moment from 'moment';

const RootWrapper = styled(Card)(
  ({ theme }) => `
    // background: ${theme.colors.gradients.green1};
    // color: ${theme.colors.alpha.white[100]};
    &:hover,
    &:focus {
      box-shadow: ${theme.colors.shadows.success};
      cursor: pointer;
    }

    .MuiCardHeader-title {
      // color: ${theme.colors.alpha.white[100]};
    }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.palette.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.error};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      // color: ${theme.colors.alpha.white[70]};
`
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        margin-right: ${theme.spacing(1)};
        height: 10px;
        // background-color: ${theme.colors.error.main};

        .MuiLinearProgress-barColorPrimary {
          // background-color: ${theme.colors.alpha.white[100]};
          border-top-right-radius: ${theme.general.borderRadius};
          border-bottom-right-radius: ${theme.general.borderRadius};
        }
`
);

function Performance() {
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  // In future we have to store userId in redux
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  function findActive(params) {
    // console.log(params);
    let current_time = parseInt(Math.floor(Date.now() / 1000));
    let active = 0
    let inactive = 0

    params.forEach((element) => {
      // console.log(element)
      // console.log(element.updatedAt)
      // console.log("current_time " + current_time)
      var gateway_time = parseInt(moment.utc(element.updatedAt).local() / 1000);
      // console.log("gateway_time " + gateway_time)
      let http_refresh_interval_mins = parseInt(element.http_refresh_interval_mins) * 60 * 3;

      // console.log("http_refresh_interval_mins" + http_refresh_interval_mins)
      if (current_time - gateway_time < http_refresh_interval_mins) {
        // console.log(element.updatedAt);
        active++
        // console.log("Active " + active);
        setActive(active)
      } else {
        inactive++
        // console.log("Inactive " + inactive);
        setInactive(inactive)
      }
    });
  }

  useEffect(() => {
    axios
      .get(
        // `http://54.202.17.198:8080/api/device/${userInfo.id}`
        `${server_url}/api/device/${userInfo.id}`
      )
      .then(async (response) => {
        const data = response.data;
        findActive(data);        
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  const navigate = useNavigate();

  function handleDevices() {
    navigate('/app/devices');
  }

  return (
    <RootWrapper sx={{ p: 1 }} onClick={handleDevices}>
      <CardHeader title="My Devices" titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <Box display="flex" sx={{ px: 2, pt: 2 }} alignItems="center">
          <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
            <AssignmentTurnedInTwoToneIcon fontSize="large" />
          </AvatarSuccess>
          <Box>
            <Typography variant="h1">{active}</Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              Active Device(s)
            </TypographySecondary>
          </Box>
        </Box>
        <Box display="flex" sx={{ px: 2, pt: 2 }} alignItems="center">
          <AvatarError sx={{ mr: 2 }} variant="rounded">
            <CancelPresentationTwoToneIcon fontSize="large" />
          </AvatarError>
          <Box>
            <Typography variant="h1">{inactive}</Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              Inactive Device(s)
            </TypographySecondary>
          </Box>
        </Box>
        <Box pt={3}>
          <LinearProgressWrapper
            value={73}
            color="primary"
            variant="determinate"
          />
        </Box>
      </CardContent>
    </RootWrapper>
  );
}

export default Performance;
