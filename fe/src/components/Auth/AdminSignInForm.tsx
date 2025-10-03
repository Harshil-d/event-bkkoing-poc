import React, { useEffect, useState } from 'react';
import { Form, useActionData, useNavigation, useSubmit } from 'react-router-dom';
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

export interface IAdminSignInFormProps {
  updateSignInErrorHandler: (error: string) => void;
  updateSignInResponseHandler: (res: ISignInResponse) => void;
}

const AdminSignInForm: React.FC<IAdminSignInFormProps> = ({
  updateSignInErrorHandler,
  updateSignInResponseHandler,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const submit = useSubmit();
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

  const emailError = errors?.find(
    (error) => error.name === 'email' && error.showOnElement
  );
  const passwordError = errors?.find(
    (error) => error.name === 'password' && error.showOnElement
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Use React Router's submit function which doesn't cause page reload
    submit(formData, { method: 'post' });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormControl error={!!emailError}>
        <FormLabel>Admin Email</FormLabel>
        <Input type='email' name='email' placeholder="Enter admin email" autoComplete="email" />
        {!!emailError && (
          <FormHelperText>
            <InfoOutlined />
            {emailError?.error}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl error={!!passwordError}>
        <FormLabel>Password</FormLabel>
        <Input
          type={showPassword ? 'text' : 'password'}
          name='password'
          autoComplete="current-password"
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
          Admin Sign In
        </Button>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <Link level='title-sm' href='/forgot-password'>
            Forgot your password?
          </Link>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link level='body-sm' href='/sign-in'>
            Regular user? Sign in here
          </Link>
        </Box>
      </Stack>
    </Form>
  );
};

export default AdminSignInForm;

