import { Avatar } from '@mui/material';

function GatewayImage(gateway_type) {
  const gateway = {
    GWD: '/static/images/avatars/4GWD.png',
    GWE: '/static/images/avatars/4GWE.png',
    GW_LT: '/static/images/avatars/GW_LT.png'
  };
  console.log(gateway_type)
  if (gateway_type == 0) {
    return (
      <Avatar
        sx={{
          mx: 'auto',
          // backgroundColor: 'grey',
          width: '25%',
          height: '25%'
        }}
        variant="rounded"
        alt="4GWE"
        src={gateway.GWE}
      />
    );
  } else if (gateway_type == 1) {
    return (
      <Avatar
        sx={{
          mx: 'auto',
          // backgroundColor: 'grey',
          width: '25%',
          height: '25%'
        }}
        variant="rounded"
        alt="4GWE"
        src={gateway.GWE}
      />
    );
  } else if (gateway_type == 2) {
    return (
      <Avatar
        sx={{
          mx: 'auto',
          // backgroundColor: 'grey',
          width: '25%',
          height: '25%'
        }}
        variant="rounded"
        alt="LT Gateway 2"
        src={gateway.GW_LT}
      />
    );
  } else {
    return (
      <Avatar
        sx={{
          mx: 'auto',
          // backgroundColor: 'grey',
          width: '25%',
          height: '25%'
        }}
        variant="rounded"
        alt="LT Gateway 2"
        src={gateway.GWD}
      />
    );

  }
}

export default GatewayImage;
