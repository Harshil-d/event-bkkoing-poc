import React, { useEffect, useState } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Stack,
} from '@mui/joy';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { InfoOutlined } from '@mui/icons-material';

import { uiActions } from '../../store/slices/ui.slice';
import { IFieldError } from '../../interfaces/forms.interface';
import { constants } from '../../constants/index.constants';
import { ISignInResponse } from '../../dtos/auth.dto';

export interface ISignInFormProps {
  updateSignInErrorHandler: (error: string) => void;
  updateSignInResponseHandler: (res: ISignInResponse) => void;
}

const SignInForm: React.FC<ISignInFormProps> = ({
  updateSignInErrorHandler,
  updateSignInResponseHandler,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const data = useActionData() as ISignInResponse;

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<IFieldError[]>();

  const navigationState = navigation.state;

  useEffect(() => {
    if (['loading', 'submitting'].includes(navigationState)) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [navigationState, dispatch]);

  useEffect(() => {
    if (
      data &&
      data.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setErrors(data.fromErrors?.fields);
    }

    if (data && data.statusCode === constants.api.httpStatusCodes.badRequest) {
      setErrors([]);
      dispatch(uiActions.removeLoader());
      updateSignInErrorHandler(data.message);
    }

    if (data && data.statusCode === constants.api.httpStatusCodes.ok) {
      setErrors([]);
      dispatch(uiActions.removeLoader());
      updateSignInResponseHandler(data);
      updateSignInErrorHandler('');
    }
  }, [data, dispatch, updateSignInErrorHandler, updateSignInResponseHandler]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const usernameError = errors?.find(
    (error) => error.name === 'username' && error.showOnElement
  );
  const passwordError = errors?.find(
    (error) => error.name === 'password' && error.showOnElement
  );

  return (
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
      <FormControl error={!!passwordError}>
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
        {!!passwordError && (
          <FormHelperText>
            <InfoOutlined />
            {passwordError?.error}
          </FormHelperText>
        )}
      </FormControl>
      <Stack sx={{ gap: 4, mt: 2 }}>
        <Button
          type='submit'
          fullWidth
          loading={['loading', 'submitting'].includes(navigationState)}
        >
          Sign in
        </Button>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row-reverse',
          }}
        >
          <Link level='title-sm' href='/forgot-password'>
            Forgot your password?
          </Link>
        </Box>
      </Stack>
    </Form>
  );
};

export default SignInForm;
