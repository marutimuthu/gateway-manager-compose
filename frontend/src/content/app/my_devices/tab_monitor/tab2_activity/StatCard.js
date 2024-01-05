import {
  Card,
  Box,
  CardContent,
  Typography,
} from '@mui/material';

import { styled } from '@mui/material/styles';

const RootWrapper = styled(Card)(
  ({ theme }) => `
    // background: ${theme.colors.gradients.green1};
    // color: ${theme.colors.alpha.white[100]};
    &:hover,
    // &:focus {
    //   box-shadow: ${theme.colors.shadows.success};
    //   cursor: pointer;
    // }

    .MuiCardHeader-title {
      // color: ${theme.colors.alpha.white[100]};
    }
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      // color: ${theme.colors.alpha.white[70]};
`
);

function StatCard({description, value}) {

  return (
    <RootWrapper sx={{ p: 1 }}>
      {/* <CardHeader title="Status - 24 hours" titleTypographyProps={{ variant: 'h3' }} /> */}
      <CardContent>
        <Box display="flex" sx={{ px: 2 }} alignItems="center">
          <Box>
            <Typography variant="h1">{value}</Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              {description}
            </TypographySecondary>
          </Box>
        </Box>
      </CardContent>
    </RootWrapper>
  );
}

export default StatCard;
