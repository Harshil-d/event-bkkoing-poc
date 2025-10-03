import { useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import CompanyLogo from '../../assets/images/full-logo.png';
import BannerLight from '../../assets/images/banner-light.avif';
import BannerDark from '../../assets/images/banner-dark.avif';
import { ColorSchemeToggle } from '../../components/UI/ColorSchemeToggle';
import SignUpForm from '../../components/Auth/SignUpForm';
import { ISignUpResponse } from '../../dtos/auth.dto';
import { constants } from '../../constants/index.constants';
import AlertMessage from '../../components/UI/AlertMessage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { handleAuthSuccess, handleAuthError } from '../../utilities/redirect.utility';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const authState = useLoaderData() as number;

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (authState === constants.auth.authState.signedIn) {
      navigate('/events');
    }
  }, [authState, navigate]);

  const handleSignUpResponse = (response: ISignUpResponse) => {
    if (response.statusCode === constants.api.httpStatusCodes.created) {
      setAlertMessage('Account created successfully! Redirecting to events page...');
      setAlertType('success');
      setShowAlert(true);
      setIsRedirecting(true);
      
      // Add a small delay to ensure tokens are fully processed, then navigate
      setTimeout(() => {
        navigate('/events', { replace: true });
      }, 100);
    } else {
      handleAuthError(
        response.message || 'Sign up failed. Please try again.',
        setAlertMessage,
        () => setShowAlert(true)
      );
      setAlertType('error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
          },
        }}
      />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `url(${BannerDark})`
              : `url(${BannerLight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            component='header'
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <img src={CompanyLogo} alt='Event Booking' height={30} />
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component='main'
            sx={{
              my: 'auto',
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component='h1' level='h2'>
                  Create Account
                </Typography>
                <Typography level='body-md'>
                  Sign up to start booking events
                </Typography>
              </Stack>
              {isRedirecting ? (
                <LoadingSpinner message="Account created successfully! Redirecting to dashboard..." />
              ) : (
                <SignUpForm onSignUpResponse={handleSignUpResponse} />
              )}
            </Stack>
          </Box>
          <Box component='footer' sx={{ py: 3 }}>
            <Typography level='body-xs' sx={{ textAlign: 'center' }}>
              © Event Booking {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Typography level='h1' sx={{ mb: 2, color: 'primary.500' }}>
            Welcome to Event Booking
          </Typography>
          <Typography level='h3' sx={{ mb: 3 }}>
            Discover and book amazing events
          </Typography>
          <Typography level='body-lg' sx={{ color: 'text.secondary' }}>
            Join thousands of users who trust our platform to find and book the best events in town.
          </Typography>
        </Box>
      </Box>
      {showAlert && (
        <AlertMessage
          color={alertType === 'success' ? 'success' : 'danger'}
          variant="soft"
          sx={{ 
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: 400
          }}
          endDecorator={
            <Button
              variant="plain"
              size="sm"
              onClick={() => setShowAlert(false)}
              sx={{ minHeight: 'auto', p: 0.5 }}
            >
              ×
            </Button>
          }
        >
          {alertMessage}
        </AlertMessage>
      )}
    </Box>
  );
};

export default SignUpPage;
