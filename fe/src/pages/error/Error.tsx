import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Box } from '@mui/joy';

import Error from '../../components/Error/Error';
import somethingWentWrong from '../../assets/images/something-went-wrong.svg';
import { RouterError } from '../../types/Router.type';
import { uiActions } from '../../store/slices/ui.slice';
import { constants } from '../../constants/index.constants';
import { ColorSchemeToggle } from '../../components/UI/ColorSchemeToggle';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useRouteError() as unknown as RouterError;

  useEffect(() => {
    if (status === 401) {
      navigate('sign-in');
    } else if (status === 403) {
      navigate('403');
    } else if (status === 404) {
      navigate('404');
    }

    dispatch(uiActions.removeLoader());
  }, [status, navigate, dispatch]);

  return (
    <>
      <Box sx={{ position: 'fixed', right: 16, top: 16 }}>
        <ColorSchemeToggle />
      </Box>
      <Error
        title='OPPS!'
        message={constants.texts.errorMessages.somethingWentWrongError}
        image={somethingWentWrong}
        actionURL='/'
        showAction={true}
        actionText='Back Home Page'
      />
    </>
  );
};

export default ErrorPage;
