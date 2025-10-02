import { useState, useEffect } from 'react';

import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
} from '@mui/joy';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

import { IResetPasswordResponse } from '../../dtos/auth.dto';
import AlertMessage from '../UI/AlertMessage';
import { constants } from '../../constants/index.constants';
import { uiActions } from '../../store/slices/ui.slice';

const ResetPasswordForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useActionData() as IResetPasswordResponse;

  const [error, setError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigationState = navigation.state;

  useEffect(() => {
    if (['loading', 'submitting'].includes(navigationState)) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [navigationState, dispatch]);

  useEffect(() => {
    setError('');
    setSuccessMessage('');
    dispatch(uiActions.removeLoader());

    if (
      data &&
      data.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      const formError = (data.fromErrors?.errors || []).join('');
      setError(formError);
    } else if (data && data.statusCode === constants.api.httpStatusCodes.ok) {
      setSuccessMessage(data.message);
    } else if (data && data.statusCode !== constants.api.httpStatusCodes.ok) {
      setError(data.message);
    }
  }, [data, dispatch, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <>
      {error && <AlertMessage color='danger'>{error}</AlertMessage>}
      {successMessage && (
        <AlertMessage color='success'>{successMessage}</AlertMessage>
      )}
      <Form method='post' noValidate>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type={showPassword ? 'text' : 'password'}
            name='password'
            endDecorator={
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <VisibilityOffRoundedIcon fontSize='inherit' />
                ) : (
                  <VisibilityRoundedIcon fontSize='inherit' />
                )}
              </IconButton>
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name='confirm-password'
            endDecorator={
              <IconButton onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? (
                  <VisibilityOffRoundedIcon fontSize='inherit' />
                ) : (
                  <VisibilityRoundedIcon fontSize='inherit' />
                )}
              </IconButton>
            }
          />
        </FormControl>
        <Stack sx={{ gap: 4, mt: 2 }}>
          <Button
            type='submit'
            fullWidth
            loading={['loading', 'submitting'].includes(navigationState)}
          >
            Submit
          </Button>
        </Stack>
      </Form>
    </>
  );
};

export default ResetPasswordForm;
