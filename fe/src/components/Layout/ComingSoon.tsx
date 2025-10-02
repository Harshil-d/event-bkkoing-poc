import { Box, Container, Grid, Typography } from '@mui/joy';

import ComingSoonImage from '../../assets/images/coming-soon.svg';

const ComingSoon = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
      }}
    >
      <Container maxWidth='md'>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid xs={12} md={6}>
            <Typography level='h1' textAlign='center'>
              Coming Soon!
            </Typography>
            <Typography textAlign='center' mt={1}>
              New features are on the way. Stay tuned for updates!
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              component='img'
              src={ComingSoonImage}
              alt='Coming Soon'
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ComingSoon;
