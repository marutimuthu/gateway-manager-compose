import { Grid, Card, Box, Badge, Typography, Avatar, Chip } from '@mui/material';
import GatewayImage from './GatewayImage'
// import styles from "./index.scss";
function StatisticsCard({
  gateway_type,
  label,
  icon,
  heading1_key,
  heading1_value,
  heading2_key,
  heading2_value,
  heading3_key,
  heading3_value,
  heading4_key,
  heading4_value,
  heading5_key,
  heading5_value,
  heading6_key,
  heading6_value,
  heading7_key,
  heading7_value,
  heading8_key,
  heading8_value,
  heading9_key,
  heading9_value,
  heading10_key,
  heading10_value,
  heading11_key,
  heading11_value,
  heading12_key,
  heading12_value,
  heading13_key,
  heading13_value,
  chip1_key,
  chip1_value
}) {
  const gateway = {
    GWD: '/static/images/avatars/4GWD.png',
    GWE: '/static/images/avatars/4GWE.png',
    GW_LT: '/static/images/avatars/GW_LT.png'
  };

  function assignChipColour(chip1_value) {
    console.log(chip1_value)
    if (chip1_value == 'Covered' || chip1_value ==  'Enabled') {
      return <Chip label={chip1_value} size="small" color="success" />
    } else {
      return <Chip label={chip1_value} size="small" color="error" />
    }
  }

  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <Card sx={{ p: 2 }}>
        <Box display="flex" alignItems="center">
          <Box md={6} sx={{ width: "100%" }} >
            <Typography variant="h4" noWrap gutterBottom>
              <Badge sx={{ mr: 1 }}>{icon}</Badge>
              {label}
            </Typography>
              {label == 'Device' ? (
                <Grid container spacing={2} columns={16} marginY={1}>
                  {
                    gateway_type != undefined ? (
                      <GatewayImage
                      gateway_type={gateway_type} />
                    )
                  :
                  (<Avatar
                  sx={{
                    mx: 'auto',
                    // backgroundColor: 'grey',
                    width: '25%',
                    height: '25%'
                  }}
                  variant="rounded"
                  alt="GW_LT"
                  src={gateway.GW_LT}
                />)
                  }
                </Grid>
              ) : (
                false
              )}

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading1_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading1_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{chip1_key}</Typography>
              </Grid>
              <Grid item md={6}>
                { 
                  typeof chip1_value !== 'undefined' ?
                  assignChipColour(chip1_value)
                  : false
                }
              </Grid>
            </Grid> 
            
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading2_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading2_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading3_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading3_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading4_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading4_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading5_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading5_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading6_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading6_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading7_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading7_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading8_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading8_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading9_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body" sx={{ wordBreak: "break-word" }}>
                  {heading9_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading10_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading10_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading11_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body" sx={{ wordBreak: "break-word" }}>
                  {heading11_value}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h5">{heading12_key}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body"  sx={{ wordBreak: "break-word" }}>
                  {heading12_value}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
}
export default StatisticsCard;
