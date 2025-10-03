import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { Box } from '@mui/joy';

import Header from '../../components/Layout/Header';
import Sidebar from '../../components/Layout/Sidebar';
import { constants } from '../../constants/index.constants';
import { getUserDetails } from '../../services/user.service';
import { userActions } from '../../store/slices/user.slice';

const RootPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useLoaderData() as number;
  const location = useLocation();

  useEffect(() => {
    // If user is not signed in, redirect to sign-in
    if (authState !== constants.auth.authState.signedIn) {
      navigate('/sign-in', { replace: true });
      return;
    }

    if (authState === constants.auth.authState.signedIn) {
      const fetchUserDetails = async () => {
        try {
          const response = await getUserDetails();

          if (response.statusCode === constants.api.httpStatusCodes.ok) {
            const payload = response.payload;

            dispatch(
              userActions.setSignInUser({
                firstName: payload!.firstName,
                lastName: payload!.lastName,
                role: payload!.role,
                organizationName: payload!.organizationName,
              })
            );
          } else {
            // If user details fetch fails, redirect to sign-in
            navigate('/sign-in', { replace: true });
          }
        } catch (error) {
          navigate('/sign-in', { replace: true });
        }
      };
      fetchUserDetails();
    }
  }, [authState, dispatch, navigate]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Header />
      <Sidebar />
      <Box
        component='main'
        className='MainContent'
        sx={{
          pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100dvh',
          gap: 1,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default RootPage;
