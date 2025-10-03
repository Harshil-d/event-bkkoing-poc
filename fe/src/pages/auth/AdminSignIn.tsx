import { useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import CompanyLogo from '../../assets/images/full-logo.png';
import BannerLight from '../../assets/images/banner-light.avif';
import BannerDark from '../../assets/images/banner-dark.avif';
import { ColorSchemeToggle } from '../../components/UI/ColorSchemeToggle';
import AdminSignInForm from '../../components/Auth/AdminSignInForm';
import { ISignInResponse } from '../../dtos/auth.dto';
import { constants } from '../../constants/index.constants';
import AlertMessage from '../../components/UI/AlertMessage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AdminSignInPage: React.FC = () => {
  const navigate = useNavigate();

  const [signInError, setSignInError] = useState<string>();
  const [signInResponse, setSignInResponse] = useState<ISignInResponse>();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const authState = useLoaderData() as number;

  const isSignIn =
    signInResponse?.statusCode === constants.api.httpStatusCodes.ok;

  useEffect(() => {
    if (isSignIn && !isRedirecting) {
      setIsRedirecting(true);
      
      // Add a small delay to ensure tokens are fully processed, then navigate
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  }, [isSignIn, isRedirecting, navigate]);

  useEffect(() => {
    if (signInResponse) {
    }
  }, [signInResponse]);

  useEffect(() => {
    if (authState === constants.auth.authState.signedIn) {
      navigate('/', { replace: true });
    }
  }, [authState, navigate]);

  const updateSignInErrorHandler = (error: string) => {
    setSignInError(error);
  };

  const updateSignInResponseHandler = (res: ISignInResponse) => {
    setSignInResponse(res);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 1)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 1)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component='header'
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <img src={CompanyLogo} alt='Event Booking Admin' height={30} />
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component='main'
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Typography component='h1' level='h3'>
                Admin Sign In
              </Typography>
              <Typography level='body-sm' color='neutral'>
                Access the admin panel to manage events and users
              </Typography>
            </Stack>
            {signInError && (
              <AlertMessage color='danger'>{signInError}</AlertMessage>
            )}
            {isRedirecting && (
              <LoadingSpinner message="Admin login successful! Redirecting to dashboard..." />
            )}
            <Stack sx={{ gap: 4, mt: 2 }}>
              <AdminSignInForm
                updateSignInErrorHandler={updateSignInErrorHandler}
                updateSignInResponseHandler={updateSignInResponseHandler}
              />
            </Stack>
          </Box>
          <Box component='footer' sx={{ py: 3 }}>
            <Typography level='body-xs' sx={{ textAlign: 'center' }}>
              © Event Booking Admin {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${BannerLight})`,
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage: `url(${BannerDark})`,
          },
        })}
      />
    </>
  );
};

export default AdminSignInPage;

