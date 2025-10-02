import { useState, useEffect } from 'react';

import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { constants } from '../../constants/index.constants';
import { uiActions } from '../../store/slices/ui.slice';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from '@mui/joy';
import { InfoOutlined } from '@mui/icons-material';
import { IForgotPasswordRequestResponse } from '../../dtos/auth.dto';
import { IFieldError } from '../../interfaces/forms.interface';
import AlertMessage from '../UI/AlertMessage';

const ForgotPasswordForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useActionData() as IForgotPasswordRequestResponse;

  const [formErrors, setFormErrors] = useState<IFieldError[]>();
  const [resetPasswordError, setResetPasswordError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const navigationState = navigation.state;

  useEffect(() => {
    if (['loading', 'submitting'].includes(navigationState)) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [navigationState, dispatch]);

  useEffect(() => {
    setFormErrors([]);
    setResetPasswordError('');
    setSuccessMessage('');
    dispatch(uiActions.removeLoader());

    if (
      data &&
      data.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      if (data.fromErrors?.fields?.length) {
        setFormErrors(data.fromErrors?.fields);
      } else {
        throw new Error('Invalid API Request');
      }
      return;
    }

    if (data && data.statusCode === constants.api.httpStatusCodes.ok) {
      setSuccessMessage(data.message);
    }

    if (data && data.statusCode !== constants.api.httpStatusCodes.ok) {
      setResetPasswordError(data.message);
    }
  }, [data, dispatch, navigate]);

  const usernameError = formErrors?.find(
    (error) => error.name === 'username' && error.showOnElement
  );

  return (
    <>
      {resetPasswordError && (
        <AlertMessage color='danger'>{resetPasswordError}</AlertMessage>
      )}
      {successMessage && (
        <AlertMessage color='success'>{successMessage}</AlertMessage>
      )}
      <Form method='post' noValidate>
        <FormControl error={!!usernameError}>
          <FormLabel>Username</FormLabel>
          <Input type='text' name='username' />
          {!!usernameError && (
            <FormHelperText>
              <InfoOutlined />
              {usernameError?.error}
            </FormHelperText>
          )}
        </FormControl>
        <Stack sx={{ gap: 4, mt: 2 }}>
          <Button
            type='submit'
            fullWidth
            loading={['loading', 'submitting'].includes(navigationState)}
          >
            Reset My Password
          </Button>
        </Stack>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;
