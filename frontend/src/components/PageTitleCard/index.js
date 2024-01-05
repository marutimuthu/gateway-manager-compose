import PropTypes from 'prop-types';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Typography, Button, Grid } from '@mui/material';

const PageTitle = ({
    heading = '',
    subHeading = '',
    docs = '',
    ...rest
}) => {
    return (
        <Grid container justifyContent="space-between" alignItems="center" {...rest}>
            <Grid item>
                <Typography variant="h4" component="h4" gutterBottom>
                    {heading}
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    href={docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                    Edit
                </Button>
            </Grid>
        </Grid>
    );
};

PageTitle.propTypes = {
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    docs: PropTypes.string,
};

export default PageTitle;
