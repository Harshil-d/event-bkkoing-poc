import { useNavigate } from 'react-router-dom';

import { Box, Container, Grid, Typography, Button } from '@mui/joy';

export interface IError {
  title: string;
  message: string;
  image: string;
  showAction: boolean;
  actionText?: string;
  actionURL?: string;
}

const Error = (props: IError) => {
  const navigate = useNavigate();

  const backHomePageHandler = () => {
    props.actionURL && navigate(props.actionURL);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth='md'>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid xs={12} md={6}>
            <Typography level='h1' textAlign='center'>
              {props.title}
            </Typography>
            <Typography textAlign='center' mt={1}>
              {props.message}
            </Typography>
            {props.showAction && (
              <Button
                onClick={backHomePageHandler}
                variant='solid'
                sx={{ mt: 2, display: 'block', mx: 'auto' }}
              >
                {props.actionText}
              </Button>
            )}
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              component='img'
              src={props.image}
              alt='Forbidden'
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Error;
